import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/**
 * Loads a simple iframe of the blog.
 * This page is located under the settings page.
 * Can be edited once access is granted to the blog's REST API (Requires payment)
 * 
 * @export
 * @class BlogPage
 */
@Component({
  selector: 'page-contents',
  templateUrl: 'contents.html'
})


export class ContentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentsPage');
  }

}
