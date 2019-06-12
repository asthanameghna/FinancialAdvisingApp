import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the Tnc page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-tnc',
    templateUrl: 'tnc.html'
})
export class TncPage {

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TncPage');
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
