import { Component } from '@angular/core';

import { NavController, ViewController, NavParams, ModalController } from 'ionic-angular';

import { FirebaseListObservable, AngularFire } from 'angularfire2';

import { FirebaseService } from '../../providers/firebase.service';
import { InsurancePolicy, CoverageListTitles } from '../../providers/variables';
import { ClaimPage } from "../claim/claim";
import { PolicyDetailsPage } from '../policy-details/policy-details';

@Component({
    selector: 'page-insurance',
    templateUrl: 'insurance.html'
})

export class InsuranceModal {
    public modal: any;
    public flavorText: any = {
        CI: 'The amount paid to you when you are diagnosed with an illness that has reached a certain stage.\nA predetermined list of illnesses under this category is outlined in your insurance policy.',
        eCI: 'The amount paid to you when you are first diagnosed with an illness.\nA predetermined list of illnesses under this category is outlined in your insurance policy.',
        death: 'The amount paid to your beneficiaries in the event of your death.',
        accidentalDeath: 'The amount paid to your beneficiaries in the event of your death due to an accident.',
        hospitalisation: 'The amount paid to you to cover your expenses for each day you are in hospital.',
        TPD: 'The amount paid to you when you are no longer able to perform any work in your occupation because of a sickness or injury.',
        disabilityIncome:'A fixed amount paid to you for each month that you are unable to work due to an accident or illness.',
        personalAccident:'The amount paid to you in case you suffer injuries, disability or death caused solely by events beyond your control.',
        maternity: 'This offers medical coverage for expectant mums and newborns, including admission to ICU and treatment for congenital illnesses.'
    }
    public policy: InsurancePolicy;
    public coverageListTitles = new CoverageListTitles();
    public policyList: FirebaseListObservable<any>;
    public notCoveredFamilyMemberList: FirebaseListObservable<any>;
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public params: NavParams, public firebase: FirebaseService, public modalCtrl: ModalController, public af: AngularFire) {
        this.policy = this.params.get('policy');
        console.log(this.policy);
    }

    ionViewWillEnter(){
        console.log("IonViewWillEnter InsuranceModal")
        this.notCoveredFamilyMemberList = this.af.database.list('/accounts/' + this.firebase.uid + '/familyMembers',{
            query: {
                orderByChild: this.params.get('policy'),
                equalTo: false
            }
        });
    }
    
    dismiss(): void {
        this.viewCtrl.dismiss();
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
        if(coverage > 0) {
            return true;
        } else {
            return false;
        }    
    }

    getCovered(): void{
        this.navCtrl.push(ClaimPage);
        this.dismiss();
    }

    navPolicyDetails(policy): void {
        this.modal = this.modalCtrl.create(PolicyDetailsPage, { policy: policy });
        this.modal.present();
    }

}