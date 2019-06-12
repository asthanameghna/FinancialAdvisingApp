import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { CoverageListTitles } from '../../providers/variables';
import { EditInsurancePage } from '../edit-insurance/edit-insurance';


@Component({
    selector: 'page-policy-details',
    templateUrl: 'policy-details.html'
})
export class PolicyDetailsPage {
	public policy;
	public coverageListTitles = new CoverageListTitles();
    constructor(public modalCtrl: ModalController,
				public navCtrl: NavController,
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public firebase: FirebaseService) {

		this.policy = this.navParams.get('policy');
		//console.log("view by policy: " + this.firebase.policies[this.policy].policyName);
	}

    ionViewDidLoad() {
      	console.log('ionViewDidLoad PolicyDetailsPage');
    }

	dismiss() {
		this.viewCtrl.dismiss();
	}

	openEditModal() {
		let modal = this.modalCtrl.create(EditInsurancePage, { toGrab: this.policy });
		modal.onDidDismiss(data =>  {
			this.policy = data;
		});
		modal.present();
	}

}
