import { Component } from '@angular/core';

import { AlertController, NavController, ModalController, NavParams } from 'ionic-angular';

import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import { InsurancePolicy, CoverageListTitles, claim} from '../../providers/variables';
import { FirebaseListObservable } from 'angularfire2/database';

import { InsuranceModal } from '../insurance/insurance';
import { PolicyDetailsPage } from '../policy-details/policy-details';
//import { AddInsurancePage } from "../add-insurance/add-insurance";
import { AddStatmentPage } from "../addstatement/addstatement";
import { ClaimPage } from "../claim/claim";
import { ClaimDetailsPage } from "../claim-details/claim-details";


@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {
    //public section: string = 'savingsinvestments';
    public claim: {};
    public modal: any;
    public section: string = 'insuranceByCoverage';
    public detailedView: any = { savings: false, equity: false };
    public coverageListTitles = new CoverageListTitles();
    public equityValue: number = 0;
    public cashValue: number = 0;
    public totalValue: number = 0;
    public equityPercentage: number = 0;
    public cashPercentage: number = 0;
    claimItemRef$ : FirebaseListObservable<any>;

    //parameters for the ionic chart for savings & investment portion.
    public portfolioChartLabels: string[] = ['Cash', 'Equity'];
    public portfolioChartData: number[] = [0, 0];
    public portfolioChartType: string = 'doughnut';
    public portfolioChartOptions: any = {
        cutoutPercentage: 75,
        defaultFontFamily: 'Montserrat',
        responsive: true,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        showLabel: true
    };
    public portfolioChartColors: any[] = [
        {
            backgroundColor: [
                'rgba(40, 52, 70, 1)',
                'rgba(247, 148, 35, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(40, 52, 70, 1)',
                'rgba(247, 148, 35, 1)'
            ]
        }
    ];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public global: GlobalService,
        public firebase: FirebaseService,
        public alertCtrl: AlertController) {
        
        this.claimItemRef$ = this.firebase.af.database.list('/claims/' + this.firebase.uid);
        this.initializeChart();
        this.setSection();

    }


    //Setting the sections to ensure it changes the tab
    setSection(){
         if(this.navParams.get('section') === 'change')
            {
                this.section = 'insuranceByPolicy';
            }
        else{
            this.section = 'insuranceByCoverage';
        }
    }

    initializeChart(): void {
        if (this.firebase.accounts.savings) {
            for (let key in this.firebase.accounts.savings) {
                if (this.firebase.accounts.savings[key].value)
                    this.cashValue += this.firebase.accounts.savings[key].value;
            }
            this.portfolioChartData[0] = this.cashValue;
        }
        if (this.firebase.accounts.investments) {
            for (let key in this.firebase.accounts.investments) {
                if (this.firebase.accounts.investments[key].value)
                    this.equityValue += this.firebase.accounts.investments[key].value;
            }
            this.portfolioChartData[1] = this.equityValue;
        }
        this.totalValue = this.equityValue + this.cashValue;
        this.equityPercentage = this.equityValue / this.totalValue;
        this.cashPercentage = this.cashValue / this.totalValue;
    }

    toggleDetailsView(type: string): void {
        switch (type) {
            case 'savings':
                if (this.cashValue > 0)
                    this.detailedView.savings = !this.detailedView.savings;
                break;
            case 'equity':
                if (this.equityValue > 0)
                    this.detailedView.equity = !this.detailedView.equity;
                break;
        }
    }

    /**
     * Method to invoke the modal for each type of insurance coverages.
     * 
     * @param {InsurancePolicy} policy 
     * 
     * @memberOf DashboardPage
     */
    navInsuranceModal(policy: InsurancePolicy): void {
        this.modal = this.modalCtrl.create(InsuranceModal, { policy: policy });
        this.modal.present();
    }


    /**
     * Method to invoke the modal for viewing the policy details.
     * 
     * @param {any} policy 
     * 
     * @memberOf DashboardPage
     */
    navPolicyDetailsModal(policy): void {
        this.modal = this.modalCtrl.create(PolicyDetailsPage, { policy: policy });
        this.modal.present();
    }

    /**
     * Method to invoke the modal for viewing the claim details.
     * 
     * @param {claim} claim 
     * 
     * @memberOf DashboardPage 
     */
    navClaimDetailsModal(claim): void {
        this.modal = this.modalCtrl.create(ClaimDetailsPage, {claim : claim});
        this.modal.present();
    }

    navAddPolicyPage():void{
        this.modal = this.modalCtrl.create(AddStatmentPage, {});
        this.modal.present();
    }

    navClaimPage():void{
        this.navCtrl.push(ClaimPage);
    }


    navClaimDetailsPage():void{
        this.navCtrl.push(ClaimDetailsPage);
    }

    /**
     * Method to check if the coverage is present in the user's database (if value > 0).
     * 
     * @param {number} coverage 
     * @returns {boolean} 
     * 
     * @memberOf DashboardPage
     */
    isPresent(coverage: number): boolean {
        if (coverage > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Creates an alert for the user to confirm deletion of policy.
     * 
     * @memberOf DashboardPage
     */
    deletePolicy(policy) {
        let alert = this.alertCtrl.create({
            message: 'Are you sure you want to delete this policy?',
            buttons: [{
                text: 'Delete',
                handler: () => {
                    alert.dismiss().then(() => {
                            this.confirmDeletePolicy(policy);
                        });
                }
            },
            {
                text: 'Cancel',
                handler: () => {
                    alert.dismiss();
                }
            }
            ]
        });
        alert.present();
    }

    /**
     * Removes the policy node from Firebase.
     * 
     * @memberOf DashboardPage
     */
    confirmDeletePolicy(policy) {
        var policyRef = this.firebase.af.database.object('/accounts/' + this.firebase.uid + '/insurance/' + policy);
        var statementRef = this.firebase.af.database.object('/statements/' + policy);
        policyRef.remove();
        statementRef.remove();
    }

    /**
     * Removes the claim node from Firebase.
     * 
     * @memberOf DashboardPage
     */
    deleteClaim(claim) {
        let alert = this.alertCtrl.create({
            message: 'Are you sure you want to delete this claim?',
            buttons: [{
                text: 'Delete',
                handler: () => {
                    alert.dismiss().then(() => {
                            this.confirmDeleteClaim(claim);
                        });
                }
            },
            {
                text: 'Cancel',
                handler: () => {
                    alert.dismiss();
                }
            }
            ]
        });
        alert.present();
    }

    confirmDeleteClaim(claim){
        var claimRef = this.firebase.af.database.object('/claims/' + this.firebase.uid + '/' + claim.$key + '/');
        claimRef.$ref.remove();       
    }

}
