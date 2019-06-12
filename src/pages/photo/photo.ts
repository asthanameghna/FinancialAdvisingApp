import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, ImagePicker } from 'ionic-native';

@Component({
	selector: 'page-photo',
	templateUrl: 'photo.html'
})
export class PhotoPage {
	public images: string[] = [];
	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad PhotoPage');
	}

	addPhoto(): any {
        const cameraOptions: any = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            cameraDirection: Camera.Direction.BACK
        };

        Camera.getPicture(cameraOptions).then((imageData) => {
            this.images.push(imageData);
            document.getElementById('uploadNavbar').click();
        }, (err) => {
            console.log('[DEBUG] ' + err);
        });
        this.dismiss();
    }

    // Calls the iamge picker plugin to take a picture from the gallery.
    choosePhoto(): void {
        const galleryOptions: any = {
            outputType: 0,   // File URI
            width: 0,
            height: 1200
        }

        ImagePicker.getPictures(galleryOptions).then(
            (imageData) => {
                imageData.forEach((image) => {
                    this.images.push(image);
                });
                document.getElementById('uploadNavbar').click();
            },
            (err) => {
                console.log('[DEBUG] ' + err);
            }
        );
        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss(this.images);
    }

}
