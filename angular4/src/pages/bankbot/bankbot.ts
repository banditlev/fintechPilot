import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './bankbot.html'
})
export class Bankbot {

    private message: string = "";
    private annoyanceCounter: number;
    private annoyanceBurst: number = 3;
    private messages: Message[] = [];

    constructor(
        private service: Service,
        private route: ActivatedRoute
    ) { }

    ngOnInit(){
        this.insertMessage("bot", "Hej, du snakker med Banky Bot");
    }

    private sendMessage(){
        if(this.message == "") {
            return;
        }
        console.log("response --> " + JSON.stringify(this.message));
        this.service.fetchBotIntent(this.message).then(
            data => {
                this.insertMessage("self", this.message);
                this.message = "";
                let response = this.handleBotResponse(data);
                this.insertMessage("bot", response);
            }
        )
    }

    private insertMessage(sender, message){
        this.messages.push(new Message(sender, message));  
    }

    private handleBotResponse(response){
        let limit = 0.9;
        let intent = null;
        console.log("response --> " + JSON.stringify(response));
        response.forEach(element => {
            if(element.value > limit){
                limit = element.value;
                intent = element.label;
            }
        });
        console.log(response);
        let intentMsg;
        switch(intent){
            case "Lønkonto":
                this.annoyanceCounter = 0;
                intentMsg = "Klassificeret: Lønkonto";
                break;
            case "Saldo":
                this.annoyanceCounter = 0;
                intentMsg = "Klassificeret: Saldo";
                break;
            case "Overblik":
                this.annoyanceCounter = 0;
                intentMsg = "Klassificeret: Overblik";
                break;
            case "Hilsen":
                this.annoyanceCounter++;
                intentMsg = this.welcomeMessage();
                break;
            default:
                intentMsg = "Den besked forstod jeg desværre ikke.";
                break;
        }
        return intentMsg;
    }

    private welcomeMessage(){
        let responseList = [];
        responseList.push("Hej med dig, hvad leder du efter?");
        responseList.push("Hej, hvordan kan jeg hjælpe?");
        responseList.push("Øh hejsa du.");
        responseList.push("Hej, hvad leder du efter?");
        if(this.annoyanceCounter >= this.annoyanceBurst){
            return "Hvad vil du mig?!";
        }
        let idx = Math.floor(Math.random() * responseList.length);
        return responseList[idx];
    }
}

class Message{
    private sender: string;
    private message: string;
    constructor(sender: string, message: string){
        this.sender = sender;
        this.message = message;
    }
}