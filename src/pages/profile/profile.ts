import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import { App, NavController, NavParams,ModalController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { BasicInfoPage } from '../basic-info/basic-info';
import { Profile } from '../../providers/variables';
import { FamilyMemberPage } from "../family-members/family-members";
import { SpeakToAdvisorPage } from "../speak-to-advisor/speak-to-advisor";



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public profile: Profile = new Profile('','',0,'','','','','',null, 0, false,null,false);

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public global: GlobalService,
              public firebase: FirebaseService, 
              public storage: Storage,
              public app: App) {
              this.profile = this.navParams.get('profile');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  navBasicInfoPage(){
    this.navCtrl.push(BasicInfoPage, { toGrab: this.profile });
  }

  navFamilyMembersPage(): void{
    this.navCtrl.push(FamilyMemberPage, { toGrab: this.profile });
  }

  navSpeakToAdvisorPage(): void{
    this.navCtrl.push(SpeakToAdvisorPage, { toGrab: this.profile });
  }

  navSettingsPage(): void {
    this.navCtrl.push(SettingsPage, { toGrab: this.profile });
  }

}
