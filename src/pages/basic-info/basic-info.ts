import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import { App, NavController, NavParams,ModalController } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { Profile } from '../../providers/variables';


@Component({
  selector: 'page-basicinfo',
  templateUrl: 'basic-info.html'
})
export class BasicInfoPage {

  public profile: Profile = new Profile('','',0,'','','','','',null, 0, false,null,false);

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public global: GlobalService,
              public firebase: FirebaseService, 
              public storage: Storage,
              public app: App) {
              this.profile = this.navParams.get('profile');
              console.log(this.profile);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logout(): void {
    this.firebase.logout();
    this.storage.set('autologin', false);
    //this.navCtrl.setPages([{page: LandingPage}], this.global.backwardTransition);
    this.app.getRootNav().setRoot(LandingPage);
  }
  openEditModal() {
		let modal = this.modalCtrl.create(EditProfilePage, { toGrab: this.profile });
		modal.onDidDismiss(data =>  {
			this.profile = data;
		});
		modal.present();
	}
}
