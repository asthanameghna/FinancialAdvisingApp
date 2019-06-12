import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalService } from '../../providers/global.service';
import { LandingPage } from '../landing/landing';


@Component({
	selector: 'page-intro',
	templateUrl: 'intro.html'
})
export class IntroPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalService) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad IntroPage');
	}

	navigateToLogin() {
		this.navCtrl.setPages([{page: LandingPage}], this.global.forwardTransition);
	}
	navigateToSignIn() {
		//for now, goes to landingpage (to be changed once signin & login page separates).
		this.navCtrl.setPages([{page: LandingPage, params: { formType: 'signup' } }], this.global.forwardTransition);
	}
}
