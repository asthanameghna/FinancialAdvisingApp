import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import { App, NavController, NavParams,ModalController } from 'ionic-angular';
import { Profile } from '../../providers/variables';
import { FirebaseListObservable, AngularFire } from 'angularfire2';



@Component({
  selector: 'page-familymembers',
  templateUrl: 'family-members.html'
})
export class FamilyMemberPage {

  public profile: Profile = new Profile('','',0,'','','','','',null, 0, false,null,false);
  public familyMemberList: FirebaseListObservable<any>;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public global: GlobalService,
              public firebase: FirebaseService, 
              public storage: Storage,
              public app: App,
              public af: AngularFire) {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter FamilyMemberPage');
    this.familyMemberList = this.af.database.list('/accounts/' + this.firebase.uid + '/familyMembers');
    this.profile = this.firebase.profile;
  }

  

}
