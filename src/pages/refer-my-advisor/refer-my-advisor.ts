import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import { App, NavController, NavParams,ModalController, ViewController } from 'ionic-angular';
import { Profile } from '../../providers/variables';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { EmailComposer } from 'ionic-native';


@Component({
  selector: 'refer-my-advisor',
  templateUrl: 'refer-my-advisor.html'
})
export class ReferMyAdvisorPage {

  public profile: Profile = new Profile('','',0,'','','','','',null, 0, false,null,false);
  public referredAdvisor: any = {name: '', contactNumber: '', email: '', agency: ''};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public global: GlobalService,
              public firebase: FirebaseService, 
              public storage: Storage,
              public app: App,
              public af: AngularFire,
              public view: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferMyAdvisorPage');
  }

  sendReferMyAdvisorEmail() {
    let email = {
        to: 'policy@hive-up.com',
        subject: 'Referred Advisor Details',
        body: 'Hi there, <br> <br> I would like to refer my policy upload to my Advisor. Following are the details: <br> <br> <br> Name: ' + this.referredAdvisor.name + '<br> <br> Contact Number: ' + this.referredAdvisor.contactNumber + '<br> <br> Email: ' + this.referredAdvisor.email + '<br> <br> Agency: ' + this.referredAdvisor.agency + '<br> <br> Thanks'
    }

    EmailComposer.open(email);
}  

dismiss() {
  this.view.dismiss();
}

}

