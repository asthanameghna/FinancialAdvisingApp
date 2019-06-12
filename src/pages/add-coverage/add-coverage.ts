import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalService } from '../../providers/global.service';

/*
DEPRECATED AS AT ITERATION 3. NOT INVOKING AS MODAL ANYMORE, WILL BE INCORPORATED INTO FORM.
*/

@Component({
	selector: 'page-add-coverage',
	templateUrl: 'add-coverage.html'
})
export class AddCoveragePage {
	public coverageToAdd: any = {
		death: null, accidentalDeath: null, CI: null, eCI: null,
		TPD: null, hospitalisation: null, personalAccident: null, retirement: null, disabilityIncome: null
	};
	public originalCoverage: any = {
		death: null, accidentalDeath: null, CI: null, eCI: null,
		TPD: null, hospitalisation: null, personalAccident: null, retirement: null, disabilityIncome: null
	};
	public selected: string[] = [];
	constructor(public modalCtrl: ModalController, public viewCtrl: ViewController,
		public navCtrl: NavController, public navParams: NavParams, public global: GlobalService) {
		console.log("obtain data next...")
		this.obtainDataFromForm();
		console.log("finished obtaining");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddCoveragePage');
	}

	obtainDataFromForm() {
		//this.coverageToAdd = this.navParams.get('toGrab');
		//this.originalCoverage = this.navParams.get('toGrab');
		this.coverageToAdd = Object.assign({}, this.navParams.get('toGrab'));
		this.originalCoverage = Object.assign({}, this.navParams.get('toGrab'));
	}

	/**
	 * Tracks the input field with the particular coverage type in the *ngFor section in HTML.
	 * 
	 * @param {number} index 
	 * @param {*} obj 
	 * @returns {*}
	 * 
	 * @memberOf AddCoveragePage
	 */
	tracker(index: number, obj: any): any {
		return obj;
	}

	/**
	 * Checks if every section has been filled, if true, calls navigate().
	 * 
	 * @returns {boolean} 
	 * 
	 * @memberOf AddCoveragePage
	 */
	passBackToMainForm(): boolean {

		for (let section in this.coverageToAdd) {
			for (let key in this.coverageToAdd[section]) {
				if (this.coverageToAdd[section][key] < 0 || this.coverageToAdd[section][key] === '') {
					this.global.createToast('Please fill in the correct amount in every field!');
					return false;
				}
			}
		}
		this.navigate();
		return true;

	}

	/**
	 * Dismiss the modal if user clicks 'back'.
	 * Pass back the original coverage object back to the add-insurance page.
	 * @memberOf AddCoveragePage
	 */
	dismiss() {
		this.coverageToAdd = Object.assign({}, this.originalCoverage);
		this.viewCtrl.dismiss(this.originalCoverage);
	}

	/**
	 * Destroys this modal and pass the coverageToAdd object back to add-insurance page.
	 * @memberOf AddCoveragePage
	 */
	navigate() {
		this.viewCtrl.dismiss(this.coverageToAdd);
	}

}
