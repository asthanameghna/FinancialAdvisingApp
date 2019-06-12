import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import { App, NavController, NavParams,ModalController } from 'ionic-angular';
import { Profile } from '../../providers/variables';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { EmailComposer } from 'ionic-native';


@Component({
  selector: 'speak-to-advisor',
  templateUrl: 'speak-to-advisor.html'
})
export class SpeakToAdvisorPage {

  //public profile: Profile = new Profile('','',0,'','','','','',null, 0, false,null,false);
  public advisorRequest: any = {intention: '', scope: '', policyGroup: '', agency: '', agencyName:'', additionalComments: ''};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public global: GlobalService,
              public firebase: FirebaseService, 
              public storage: Storage,
              public app: App,
              public af: AngularFire) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpeakToAdvisorPage');
  }

  onChange(selectedValue){
    this.advisorRequest.intention = selectedValue;
  }

  sendAdvisorRequestEmail() {
    if (this.advisorRequest.policyGroup=="" && this.advisorRequest.agencyName=="")
    {
    let email = {
        to: 'policy@hive-up.com',
        subject: 'Advisor Request',
        body: 'Hi there, <br> <br> I would like to speak to an advisor. Following are my details for the request - <br> <br> <br> Intention: ' + this.advisorRequest.intention + '<br> <br> Scope: ' + this.advisorRequest.scope + '<br> <br> Agency: ' + this.advisorRequest.agency + '<br> <br> Additional Comments: ' + this.advisorRequest.additionalComments + '<br> <br> <br> Thanks'
        
    }
    EmailComposer.open(email);
  }
  else if (this.advisorRequest.policyGroup!="" && this.advisorRequest.agencyName!="")
    {
    let email = {
        to: 'policy@hive-up.com',
        subject: 'Advisor Request',
        body: 'Hi there, <br> <br> I would like to speak to an advisor. Following are my details for the request - <br> <br> <br> Intention: ' + this.advisorRequest.intention + '<br> <br> Scope: ' + this.advisorRequest.scope + '<br> <br> Policy Group: ' + this.advisorRequest.policyGroup + '<br> <br> Agency: ' + this.advisorRequest.agency  + '<br> <br> Agency Name: ' + this.advisorRequest.agencyName + '<br> <br> Additional Comments: ' + this.advisorRequest.additionalComments + '<br> <br> <br> Thanks'
        
    }
    EmailComposer.open(email);
  }
  else if (this.advisorRequest.policyGroup!="")
    {
    let email = {
        to: 'policy@hive-up.com',
        subject: 'Advisor Request',
        body: 'Hi there, <br> <br> I would like to speak to an advisor. Following are my details for the request - <br> <br> <br> Intention: ' + this.advisorRequest.intention + '<br> <br> Scope: ' + this.advisorRequest.scope + '<br> <br> Policy Group: ' + this.advisorRequest.policyGroup + '<br> <br> Agency: ' + this.advisorRequest.agency + '<br> <br> Additional Comments: ' + this.advisorRequest.additionalComments + '<br> <br> <br> Thanks'
        
    }
    EmailComposer.open(email);
  }
  else
    {
    let email = {
        to: 'policy@hive-up.com',
        subject: 'Advisor Request',
        body: 'Hi there, <br> <br> I would like to speak to an advisor. Following are my details for the request - <br> <br> <br> Intention: ' + this.advisorRequest.intention + '<br> <br> Scope: ' + this.advisorRequest.scope + '<br> <br> Agency: ' + this.advisorRequest.agency +  '<br> <br> Agency Name: ' + this.advisorRequest.agencyName + '<br> <br> Additional Comments: ' + this.advisorRequest.additionalComments + '<br> <br> <br> Thanks'
        
    }
    EmailComposer.open(email);
  }
} 

}