import { Component } from '@angular/core';

import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { claim,Notification } from '../../providers/variables';

import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service'
import { AddStatmentPage } from '../addstatement/addstatement';

import { ClaimDetailsPage } from '../claim-details/claim-details';

declare var cordova: any;

@Component({
	selector: 'page-edit-claim-details',
	templateUrl: 'edit-claim-details.html'
})
export class EditClaimDetailsPage {
        public claimToEdit = this.navParams.get('toGrab');
        public originalClaim: any;
        public claimUID: string;
        public claim : claim = new claim(this.claimToEdit.policyToClaim,
                                         this.claimToEdit.countryOfIncident,
                                         this.claimToEdit.cityOfIncident,
                                         this.claimToEdit.dateOfIncident,
                                         this.claimToEdit.describeIncident,
                                         this.claimToEdit.typeOfLoss,
                                         Date.now(),
                                         'Enquired');
        public requestURL: any;
        public notification: Notification = new Notification('','claim','',0,'',[]);

        constructor(public navCtrl: NavController, 
            public global: GlobalService, 
            public firebase: FirebaseService,
            public navParams: NavParams,
            public viewCtrl: ViewController,
            public events: Events) {
    }
    
    ionViewDidLoad() {		
        this.obtainData();
        console.log('ionViewDidLoad EditClaimDetailsPage');
    }

    obtainData(){
        this.claimToEdit = this.navParams.get('toGrab');
        this.originalClaim = JSON.parse(JSON.stringify(this.navParams.get('toGrab')));
        this.populateData();
    }

    submitForm(){
        var claimRef = this.firebase.af.database.object('/claims/' + this.firebase.uid + '/' + this.claimToEdit + '/');
        claimRef.update(this.claim).then(() => {
            this.global.createToast('Your request was successfully edited!');
            this.dismissPage()
        })
    }

    // generateNotification(){
    //     this.notification.message = 'Your claims has been edited.',
    //     this.notification.policyName = this.claim.typeOfLoss;
    //     this.notification.timestamp = Date.now();
    //     this.notification.type = 'policy';
    //     this.notification.uid = this.firebase.uid;
    //     var notificationListRef = this.firebase.af.database.list('/notifications');
    //     notificationListRef.push(this.notification);
    // }

    dismissPage(){
        this.viewCtrl.dismiss(this.originalClaim);
    }

    

    populateData() {
		//populate the current claim instance.
		for (let section in this.firebase.claim[this.claimToEdit]) {
			this.claim[section] = this.firebase.claim[this.claimToEdit][section];
		}
    }

    onSelectChange(selectedValue: any) {
        if(selectedValue === 'addPolicy') {
            //navigate to add policy page
            this.events.publish('addPolicy', selectedValue);
            this.navCtrl.push(AddStatmentPage);
        }
    }
    
  

    }