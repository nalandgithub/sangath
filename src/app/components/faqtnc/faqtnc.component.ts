import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqtnc',
  templateUrl: './faqtnc.component.html',
  styleUrls: ['./faqtnc.component.scss'],
})
export class FaqtncComponent implements OnInit {
  public technologies: Array<{ name: string, description: string }> = [
    {
      name: '1 - Who can see my posts?',
      description: 'There are options like ‘everyone’ and ‘friends’. Selecting ‘everyone’ will make your post visible to all users whether he is your friend or not. Selecting ‘friends’ will just make it visible to your friends.'
    },
    {
      name: '2 - How can I add a new friend?',
      description: 'To add a new friend, you will have to send a friend request to the user by adding his <span style="color:#961175">SANGATH</span> id from the ”add friend” option. You will be added as a friend once the opposite person accepts your friend request.'
    },
    {
      name: '3 - Is there any charge for the trip?',
      description: '<span style="color:#961175">SANGATH</span> doesn’t charge you anything for the trip. However, there is a subscription plan that allows you to post on the platform and view other posts on the platform. First 3 months are complimentary from <span style="color:#961175">SANGATH</span> as a joining bonus. Other plans can be found in the Subscription tab.'
    },
    {
      name: '4 - Can others view my name on the Posts?',
      description: 'When you add “I have a car post” , you have the option for allowing you to display your name or not. But when you request for “i want to travel” , your name will be always visible to everyone so that the one with the car can easily know the identity of the user who posted the request.'
    },
    {
      name: '5 - What if my plan gets cancelled about traveling?',
      description: "<span style='color:#961175'>SANGATH</span> doesn’t confirm the trip and doesn't confirm the seat of the traveler. It is solely up on the car owner to make the decision of the travel status, time and date. Users can cancel anytime his/her plan if he wants to and delete the post that was posted on the platform."
    },
    {
      name: '6 - What type of Parcels can I send?',
      description: 'Parcels can contain food items, clothes or things that are not priced very high or valued more. Neither <span style="color:#961175">SANGATH</span> nor the carrier takes any types of responsibility for the parcels, if lost or broken. Also, please decide the collection place and time for the parcel pickup according to the convenience of the traveler before the trip only.'
    },
    {
      name: '7 - What about my data privacy?',
      description: "<span style='color:#961175'>SANGATH</span> does not collect any private or sensitive data from the user other than their phone number and email-id. Also, we don't share any data of our users with any third parties. So the users really don't need to worry about their privacy being compromised."
    },
    {
      name: '8 - How many devices can I simultanously login to?',
      description: "Due to security reasons and data privacies, <span style='color:#961175'>SANGATH</span> allows only one device login at a time for one account."
    },
    {
      name: '9 - How to deactivate my account?',
      description: "From the SETTINGS menu, you wil find an option to deactivate your account. Once you deactivate the account, you will have to contact administrator to reactivate the account from the same number."
    }
  ];

  constructor() { }

  ngOnInit() { }
  public captureName(event: any): void {
    //console.log(`Captured name by event value: ${event}`);
  }

}
