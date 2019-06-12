import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import firebase from 'firebase';
import { GlobalService } from '../../providers/global.service';
import { InsuranceStatement, CoverageListTitles, Statement, Notification } from '../../providers/variables';
import { Camera, ImagePicker, File } from 'ionic-native';

declare var cordova: any;

@Component({
	selector: 'page-edit-insurance',
	templateUrl: 'edit-insurance.html'
})
export class EditInsurancePage {
	public policyToEdit: any;
	//to return originalPolicy if user press cancel... Since ngModel binds data dynamically we have to keep a copy.
	public originalPolicy: any;
	public coverageToAdd: any = {
		death: null, accidentalDeath: null, CI: null, eCI: null,
		TPD: null, hospitalisation: null, personalAccident: null, maternity: null, disabilityIncome: null
	};
    public monthNames: any = { '01': "Jan", '02': "Feb", '03': "Mar", '04':"Apr", '05': "May", '06': "Jun",
        '07': "Jul", '08': "Aug", '09': "Sep", '10': "Oct", '11': "Nov", '12': "Dec"
    };
	public coverageListTitles = new CoverageListTitles();
	public selected: string[] = [];
	public images: string[] = [];
    public statement: Statement = new Statement(this.firebase.profile.name, this.firebase.profile.email, "2", [], undefined, Date.now(), false, false, true);
	public insuranceStatement: InsuranceStatement = new InsuranceStatement(null, null, '', '','', 0, '', '', '', null, '', undefined, '', '', '', '', '', '', '', '', '', null, '', null, []);
    public flag: boolean = false;
    public uploadToggle: boolean = false;
    public uploadTitle: string = '';
    public uploadProgressPercentage: number = 0;
    public uploadIndex: number;
    public uploadExisting: number;
    public uploadProgress: number;
    public uploadTotal: number;
    public notification: Notification = new Notification('','policy','',0,'',[]);

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public firebase: FirebaseService,
		public global: GlobalService,
        public platform: Platform)
	{ }

	ionViewDidLoad() {
		this.obtainData();
		
		console.log('ionViewDidLoad EditInsurancePage');
	}

	dismiss() {
		this.policyToEdit = JSON.parse(JSON.stringify(this.originalPolicy));
		this.viewCtrl.dismiss(this.originalPolicy);
	}

	/**
	 * Method to be called to obtain the policy data from the policy details page.
	 * Makes a copy of the policy data, in case the user presses cancel.
	 * @memberOf EditInsurancePage
	 */
	obtainData() {
		this.policyToEdit = this.navParams.get('toGrab');
		this.originalPolicy = JSON.parse(JSON.stringify(this.navParams.get('toGrab')));
		this.populateData();
	}


	/**
	 * Pre-process the form using the policy data obtained in obtainData().
	 * Populates the selected array (ion-select returns an array)
	 * @memberOf EditInsurancePage
	 */
	populateData() {
		//populate the current InsuranceStatement instance.
		for (let section in this.firebase.policies[this.policyToEdit]) {
			this.insuranceStatement[section] = this.firebase.policies[this.policyToEdit][section];
		}
		//populate the coverageToAdd object for parsing of various coverages. 
		this.coverageToAdd = JSON.parse(JSON.stringify(this.insuranceStatement.coverage));
		//populate the "selected" array for coverage display purposes.
		for (let key in this.insuranceStatement.coverage) {
			this.selected.push(key);
		}

		this.images = JSON.parse(JSON.stringify(this.insuranceStatement.photos));

        //we temporarily remove the original URL in the insuranceStatement.photos first.
        this.insuranceStatement.photos = JSON.parse(JSON.stringify([]));

        //convert the date format back to YYYY MM DD for display in ion-datetime.
        this.insuranceStatement.policyTermFrom = new Date(this.convertBackDate(this.insuranceStatement.policyTermFrom)).toISOString();
        this.insuranceStatement.policyTermTo = new Date(this.convertBackDate(this.insuranceStatement.policyTermTo)).toISOString();
	}

/* **************************************Methods to process the forms below *************************************/

    checkFormInformation() {
        if (this.images.length > 5) {
            this.global.createToast('Sorry! You can only include 5 images for this statement.');
            return false;
        }
        for(let cov in this.coverageToAdd) {
            if(this.coverageToAdd[cov] === "" || this.coverageToAdd[cov] === 0) {
                this.coverageToAdd[cov] = null;
            }
        }

        this.insuranceStatement.coverage = JSON.parse(JSON.stringify(this.coverageToAdd));
        for (let section in this.insuranceStatement.coverage) {

            if (this.insuranceStatement.coverage[section] === null 
                || this.insuranceStatement.coverage[section] === '' 
                || this.insuranceStatement.coverage[section] === undefined) {
                this.flag = true;
            } else {
                this.flag = false;
                break;
            }          
        }

        if (this.flag === true) {
            this.global.createToast('Please select at least one type of coverages!');
            return false;
        }
        //truncate to maintain the datetime format.
        this.insuranceStatement.policyTermFrom = this.insuranceStatement.policyTermFrom.substring(0, 10);
        this.insuranceStatement.policyTermFrom = this.processDate(this.insuranceStatement.policyTermFrom);
        this.insuranceStatement.policyTermTo = this.insuranceStatement.policyTermTo.substring(0, 10);
        this.insuranceStatement.policyTermTo = this.processDate(this.insuranceStatement.policyTermTo);
        this.submitForm();
        return true;  
	}

    submitForm() {
        //clears the list of photos in firebase first
        var imageRef = this.firebase.af.database.list('/accounts/' + this.firebase.uid + '/insurance/' + this.policyToEdit + '/photos/');
        imageRef.remove();
        this.uploadToggle = true;
        this.uploadTitle = 'Uploading statement...';
        this.uploadProgressPercentage = 0;
        var insuranceRef = this.firebase.af.database.object('/accounts/' + this.firebase.uid + '/insurance/' + this.policyToEdit);
        //process the images(if updated)

        this.statement.details = JSON.parse(JSON.stringify(this.insuranceStatement));
        insuranceRef.update(this.insuranceStatement).then((report) => {
            var storageRef = this.firebase.af.database.object('/statements/' + this.policyToEdit + '/');
            storageRef.update(this.statement).then(() => {
                this.uploadIndex = 0
                this.uploadProgress = 0;
                this.uploadExisting = 0;
                this.uploadTotal = this.images.length;

                this.uploadPictures(this.policyToEdit);
          });

        });
        
    }

    uploadPictures(statementId: string): any {

        this.uploadTitle = 'Uploading pictures...';
        if (this.uploadIndex < this.images.length) {

            if(this.images[this.uploadIndex].substring(0, 5) !== 'https') {
                console.log("not https, proceed with uploading img.");
                this.uploadPicture(statementId, this.images[this.uploadIndex]).then(
                    () => {
                        this.uploadIndex++;
                        this.uploadPictures(statementId);
                    }
                )
            } else {
                //it's from the pre-edited version. Just push to da list.
                this.insuranceStatement.photos.push(this.images[this.uploadIndex]);
                this.uploadIndex++;
                this.uploadPictures(statementId);
            }    
        }
        else if (this.uploadIndex === this.images.length) {
            this.finishedUploading(statementId);
        }
    }

    uploadPicture(statementId: string, imageUrl: string): Promise<any> {
        let directory, fileName;

        // Cases for different filesystems; camera vs gallery
        return new Promise((resolve, reject) => {
            File.resolveLocalFilesystemUrl(imageUrl).then(
                (fileEntry) => {
                    if (this.platform.is('ios')) {
                        directory = cordova.file.tempDirectory;
                        fileName = fileEntry.name;
                    }
                    else if (this.platform.is('android')) {
                        if (fileEntry.filesystem.name === 'cache')
                            directory = cordova.file.cacheDirectory;
                        else if (fileEntry.filesystem.name === 'cache-external')
                            directory = cordova.file.externalCacheDirectory;
                        fileName = fileEntry.name;
                    }

                    let photoMeta = { contentType: 'image/jpeg' };
                    let storagePhotoRef = firebase.storage().ref().child('statements/' + this.firebase.uid + '/' + statementId + '/' + (this.uploadIndex + 1).toString() + '.jpg');
                    File.readAsArrayBuffer(directory, fileName).then(
                        (data) => {
                            let imageBlob = new Blob([data], { type: 'image/jpeg' });
                            storagePhotoRef.put(imageBlob, photoMeta).then((data) => {
                                this.insuranceStatement.photos.push(data.downloadURL);
                                setInterval(this.runningVariable(), 3000);
                                //this.uploadProgressPercentage = +((this.uploadProgress / this.uploadTotal).toFixed(2)) * 100;
                                resolve();
                            })
                        },
                        (err) => {
                            console.log(err.message);
                            reject();
                        }
                    );
                },
                (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }

    finishedUploading(statementID: string): any {
        let statement = this.firebase.af.database.object('/accounts/' + this.firebase.uid + '/insurance/' + statementID);
        statement.update(this.insuranceStatement).then(
            (data) => {
                //this.clearFields();
                this.generateNotification();
                this.resetForm();
                this.uploadToggle = false;
            },
            (err: Error) => console.log(err.message)
        );
    }
    
	/**
     * Method to create the alert pop up for user to choose camera/gallery.
     * @memberOf AddInsurancePage
     */
    selectPhotoForReference(): void {
        if (this.images.length === 5) {
            this.global.createToast('Sorry! You have reached the limit of 5 images per statement.');
        }
        else {
            let alert = this.alertCtrl.create({
                message: 'Where you would like to get your picture from?',
                buttons: [{
                    text: 'Camera',
                    handler: () => {
                        console.log('[DEBUG] Take picture from camera.');
                        alert.dismiss().then(() => {
                            this.addPhoto();
                        });
                    }
                },
                {
                    text: 'Gallery',
                    cssClass: 'nobold',
                    handler: () => {
                        console.log('[DEBUG] Retrieve picture from gallery.');
                        alert.dismiss().then(() => {
                            this.choosePhoto();
                        });
                    }
                }
                ]
            });

            alert.present();
        }
  }
    /**
     * method to invoke the camera.
     *
     * @memberOf AddInsurancePage
     */
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
    }

    /**
     * Method to invoke the camera.
     *
     *
     * @memberOf AddInsurancePage
     */
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
    }
    deletePhoto(index): void {
        this.images.splice(index, 1);
    }


    /**
     * Method to invoke the popup when user clicks delete.
     *
     *
     * @memberOf AddInsurancePage
     */
    confirmDeletePhoto(index): void {
        let alert = this.alertCtrl.create({
            message: 'Delete this photo?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    alert.dismiss();
                }
            },
            {
                text: 'Delete',
                handler: () => {
                    alert.dismiss().then(() => {
                        this.deletePhoto(index);
                    });
                }
            }]
        });

        alert.present();
    }

    markForDeletion(index) {
        this.confirmDeletePhoto(index);
    }

    runningVariable() {
        this.uploadProgress++;
        var temp = this.uploadProgressPercentage;
        var i = +((this.uploadProgress / this.uploadTotal).toFixed(2)) * 100;
        for (var j = temp; j < i; j++) {
            this.uploadProgressPercentage++;
        }
    }

    resetForm(): void {
        this.uploadToggle = false;
        this.flag = false;
        this.uploadIndex = 0
        this.uploadProgress = 0;
        this.uploadExisting = 0;
        this.uploadTotal = 0;
        this.uploadProgressPercentage = 0;
        this.uploadTitle = '';
        this.images = [];

        this.global.createToast('Your policy has been updated!').then(() => {
            this.dismiss();
        });
    }
    //method to change the month from number to short forms.
    processDate(date) {
        //if it's new input data (YYYY-MM-DD)
        if(date.substring(4, 5) === '-') {
            var index = 5;  //end position of year
            var replace = this.monthNames[date.substring(5,7)];
            var res = date.substring(8) + ' ' + replace + ' ' + date.substring(0, index-1);
            return res;
        } else {    //it's unchanged (DD MMM YYYY)
            return date;
        }
    }


    //for unknown reason, parsing a date string like 02 Jan 2010 returns an ISO string of 2010-01-01
    //which is 1 day earlier... Hence we convert the date string to YYYY-MM-DD before casting it as an ISO.
    convertBackDate(date) {
        //date in: DD MMM YYYY
        var days = date.substring(0, 2);
        var month = date.substring(3, 6);
        for (var key in this.monthNames) {
            if (this.monthNames[key] === month) {
                month = key;
            }
        }
        var year = date.substring(7);
        return (year + '-' + month + '-' + days);
    }

    generateNotification(){
        this.notification.message = 'Your policy has been edited.',
        this.notification.policyName = this.insuranceStatement.policyName;
        this.notification.timestamp = Date.now();
        this.notification.type = 'policy';
        this.notification.uid = this.firebase.uid;
        var notificationListRef = this.firebase.af.database.list('/notifications');
        notificationListRef.push(this.notification);
    }
}
