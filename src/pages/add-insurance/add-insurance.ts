import { Component } from '@angular/core';
import { AlertController, ViewController, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import firebase from 'firebase';
import { GlobalService } from '../../providers/global.service';
import { InsuranceStatement, CoverageListTitles, Statement, Notification } from '../../providers/variables';
import { AddCoveragePage } from '../add-coverage/add-coverage';
import { TabsPage } from '../home/home';
import { Camera, ImagePicker, File } from 'ionic-native';


declare var cordova: any;

/**
 * This class controls the manual addition of insurance policies by the user
 * 
 * @export
 * @class AddInsurancePage
 */
@Component({
    selector: 'page-add-insurance',
    templateUrl: 'add-insurance.html'
})
export class AddInsurancePage {
    //local coverage object. To be uploaded to Firebase.
    public coverageToAdd: any = {
		death: null, accidentalDeath: null, CI: null, eCI: null,
		TPD: null, hospitalisation: null, personalAccident: null, maternity: null, disabilityIncome: null
    };
    public monthNames: any = { '01': "Jan", '02': "Feb", '03': "Mar", '04':"Apr", '05': "May", '06': "Jun",
        '07': "Jul", '08': "Aug", '09': "Sep", '10': "Oct", '11': "Nov", '12': "Dec"
    };
    public coverageListTitles = new CoverageListTitles();
    public selected: string[] = []; //array of coverages selected in ion-select.
    public insuranceStatement: InsuranceStatement = new InsuranceStatement(null, null, '', '', '', null, '', '', '', null, '', undefined, '', '', '', '', '', '', '', '', '', null, '', null, []);
    public statement: Statement = new Statement(this.firebase.profile.name, this.firebase.profile.email, "2", [], undefined, Date.now(), false, false, true);
    public images: string[] = [];
    public coverageGet: string[] = [];
    public statementID: string;
    public flag: boolean = false;
    public uploadToggle: boolean = false;
    public uploadTitle: string = '';
    public uploadProgressPercentage: number = 0;
    public uploadIndex: number;
    public uploadExisting: number;
    public uploadProgress: number;
    public uploadTotal: number;
    public notification: Notification = new Notification('','policy','',0,'',[]);

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public view: ViewController,
        public alertCtrl: AlertController,
        public global: GlobalService,
        public firebase: FirebaseService,
        public modalCtrl: ModalController,
        public platform: Platform) { }


    ionViewDidLoad() {
        console.log('ionViewDidLoad AddInsurancePage');
        //this.insuranceStatement.photos.push("test");
        this.images = [];
        this.insuranceStatement.policyTermFrom = new Date().toISOString();
        this.insuranceStatement.policyTermTo = new Date().toISOString();
    }

    //Method to make sure the coverageToAdd conforms to the user input on ion-select.
    onSelectChange(selectedValues: any) {
        
        for(let cov in selectedValues) {
            for(let key in this.coverageToAdd) {
                if(JSON.stringify(selectedValues[cov]) !== JSON.stringify(key)) {
                    this.coverageToAdd[key] = null;                                                             
                }
            }
        }

    }


/*******DEPRECATED AS AT ITERATION 3. NOT INVOKING AS MODAL ANYMORE, WILL BE INCORPORATED INTO FORM.***********/
    /**
     * opens the modal for coverage, gets the data after the modal has been dismissed.
     * 
     * 
     * @memberOf AddInsurancePage
     */
    openCoverageModal() {
        let coverageModal = this.modalCtrl.create(AddCoveragePage, { toGrab: this.insuranceStatement.coverage });
        coverageModal.onDidDismiss(data => {
            this.insuranceStatement.coverage = data;
        });
        coverageModal.present();
    }
/************************************************************************************************************* */

    dismiss() {
        this.view.dismiss();
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
        /*
        if (this.selectedIndex !== 0 && this.selectedIndex === this.images.length - 1) {
            this.selectedIndex--;
        }
        this.images.splice(this.selectedIndex, 1); */
        this.images.splice(index, 1);
    }

    markForDeletion(index) {
        this.confirmDeletePhoto(index);
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



  /**
   * Checks if every section of the form has been filled.
   * If false, create toast to notify the user. Else, executes submitforms().
   * @returns {Boolean}
   *
   * @memberOf AddInsurancePage
   */
  checkFormInformation(): Boolean {

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
    if(this.flag === true) {
        this.global.createToast('Please key in coverage amount');
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


  /**
   * Submits the form.
   * Uploads the insuranceStatement (sans the photos) into Firebase.
   * Calls uploadPictures to process the URL of photos.
   *
   * @memberOf AddInsurancePage
   */
  submitForm(): void {
    this.statement.details = JSON.parse(JSON.stringify(this.insuranceStatement));
//push insuranceStatement, then push images.
    this.uploadToggle = true;
    this.uploadTitle = 'Uploading statement...';
    this.uploadProgressPercentage = 0;
    var insuranceRef = this.firebase.af.database.list('/accounts/' + this.firebase.uid + '/insurance/');
      //console.log(insuranceRef);


    if (this.platform.is('ios') || this.platform.is('android')) {
      insuranceRef.push(this.insuranceStatement).then((report) => {
          this.statementID = report.key;
          var storageRef = this.firebase.af.database.object('/statements/' + this.statementID + '/');
          storageRef.update(this.statement).then(() => {
                this.uploadIndex = 0
                this.uploadProgress = 0;
                this.uploadExisting = 0;
                this.uploadTotal = this.images.length;

                this.uploadPictures(this.statementID);
          });
        this.generateNotification();
      });

    }

  }

  /**
   * Driver method to process the URL of images to be updated into Firebase.
   * Calls uploadPicture() according to the number of photos user has (tracked by uploadIndex).
   * @param {string} statementId
   * @returns {*}
   *
   * @memberOf AddInsurancePage
   */
  uploadPictures(statementId: string): any {
        this.uploadTitle = 'Uploading pictures...';
        if (this.uploadIndex < this.images.length) {
            this.uploadPicture(statementId, this.images[this.uploadIndex]).then(
                () => {
                    this.uploadIndex++;
                    this.uploadPictures(statementId);
                }
            )
        }
        else if (this.uploadIndex === this.images.length) {
            this.finishedUploading(statementId);
        }
    }

    /**
     * Method to process the URL of images to be updated into Firebase.
     * After the URL processing, pushes the URL into photos array of the insuranceStatement (to be updated in Firebase).
     *
     * @param {string} statementId
     * @param {string} imageUrl
     * @returns {Promise<any>}
     *
     * @memberOf AddInsurancePage
     */
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


    /**
     * Method to update the Firebase node that contains the insuranceStatement, with the new photos array.
     *
     * @param {string} statementID
     * @returns {*}
     *
     * @memberOf AddInsurancePage
     */
    finishedUploading(statementID: string): any {
        let statement = this.firebase.af.database.object('/accounts/' + this.firebase.uid + '/insurance/' + statementID);
        statement.update(this.insuranceStatement).then(
            (data) => {
                //this.clearFields();
                //this.resetForm();
                //this.uploadToggle = false;
            },
            (err: Error) => console.log(err.message)
        );
        let statementRef = this.firebase.af.database.object('/statements/' + this.statementID + '/');
        statementRef.update(this.insuranceStatement).then(
            (data) => {
                //this.clearFields();
                this.resetForm();
                this.uploadToggle = false;
            }
        );
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

        this.global.createToast('Your statement was successfully uploaded!').then(() => {
            this.dismiss();
            //navigate to dashboard
            this.navCtrl.push(TabsPage ,{index: "0"});
        });
    }

    runningVariable() {
        this.uploadProgress++;
        var temp = this.uploadProgressPercentage;
        var i = +((this.uploadProgress / this.uploadTotal).toFixed(2)) * 100;
        for (var j = temp; j < i; j++) {
            this.uploadProgressPercentage++;
        }
    }

    //method to change the month from number to short forms.
    processDate(date) {
        var index = 5;  //end position of year
        var replace = this.monthNames[date.substring(5,7)];
        var res = date.substring(8) + ' ' + replace + ' ' + date.substring(0, index-1);
        return res;
    }

    generateNotification(){
        this.notification.message = 'A new policy has been added.',
        this.notification.policyName = this.insuranceStatement.policyName;
        this.notification.timestamp = Date.now();
        this.notification.type = 'policy';
        this.notification.uid = this.firebase.uid;
        var notificationListRef = this.firebase.af.database.list('/notifications');
        notificationListRef.push(this.notification);
    }
}
