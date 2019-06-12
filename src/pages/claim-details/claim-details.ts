import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { CoverageListTitles } from '../../providers/variables';
import { EditInsurancePage } from '../edit-insurance/edit-insurance';
import { FirebaseListObservable } from 'angularfire2/database';
import { EditClaimDetailsPage } from '../edit-claim-details/edit-claim-details';


@Component({
    selector: 'page-claim-details',
    templateUrl: 'claim-details.html'
})
export class ClaimDetailsPage {
	public claim;
	claimItemRef$ : FirebaseListObservable<any>;
    constructor(public modalCtrl: ModalController,
				public navCtrl: NavController,
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public firebase: FirebaseService) {

		this.claim = this.navParams.get('claim');
	}

    ionViewWillEnter() {
		console.log('ionViewWillEnter ClaimDetailsPage');
    }

	dismiss() {
		this.viewCtrl.dismiss();
	}

	openEditModal() {
		let modal = this.modalCtrl.create(EditClaimDetailsPage, { toGrab: this.claim });
		modal.onDidDismiss(data =>  {
			this.claim = data;
		});
		modal.present();
	}

}
