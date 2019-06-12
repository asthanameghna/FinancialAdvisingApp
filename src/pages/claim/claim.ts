import { Component } from '@angular/core';

import { Events, NavController, NavParams } from 'ionic-angular';
import { claim } from '../../providers/variables';

import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service'
import { AddStatmentPage } from '../addstatement/addstatement';

@Component({
  selector: 'page-claim',
  templateUrl: 'claim.html'
})
export class ClaimPage {

    public claim : claim = new claim('','','','','','', Date.now(),'Enquired');

    constructor(public navCtrl: NavController, 
        public global: GlobalService, 
        public firebase: FirebaseService,
        public navParams: NavParams,
        public events: Events) {
}

ionViewDidLoad() {		
    console.log('ionViewDidLoad ClaimPage');
}

onSelectChange(selectedValue: any) {
    if(selectedValue === 'addPolicy') {
        //navigate to add policy page
        this.events.publish('addPolicy', selectedValue);
        this.navCtrl.push(AddStatmentPage);
    }
}

checkContactInformation(): Boolean {
    this.submitContactInformation();
    this.resetForm();
    return true;
}

submitContactInformation(): void {
    let requestUrl = this.firebase.af.database.list('/claims/' + this.firebase.uid);
    let profileUrl = this.firebase.af.database.object('/users/' + this.firebase.uid);


    requestUrl.push(this.claim).then(() => {
        this.firebase.profile.advisorRequested = true;
        if (this.firebase.profile.$key)
            delete this.firebase.profile.$key;
        if (this.firebase.profile.$exists)
            delete this.firebase.profile.$exists;
        console.log(this.firebase.profile);
        profileUrl.update(this.firebase.profile).then(() => {
            this.global.createToast('Your request was successfully sent to our team!');
        })
    });
}
resetForm() {
    this.claim.policyToClaim = null,
    this.claim.countryOfIncident = null,
    this.claim.cityOfIncident = null,
    this.claim.dateOfIncident = null,
    this.claim.describeIncident = null,
    this.claim.typeOfLoss = null
}
}
