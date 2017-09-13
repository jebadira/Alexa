'use strict';

var data = require('./data.json');
const Alexa = require('alexa-sdk');
var https = require('https');
var request = require('request');
const APP_ID = "amzn1.ask.skill.fa47f87b-6b5b-4615-8a88-5b37db221232"; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Campaign App',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the goal? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the goal, what\'s the current campaign progress, what is the current progress for the Law school, or, you can say stop...Now, what can I help you with?",
            HELP_REPROMPT:  "You can ask questions such as, what\'s the goal, what\'s the current campaign progress, what is the current progress for the Law school, or, you can say stop...Now, what can I help you with?",
            STOP_MESSAGE: 'Peace!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            NOT_SURE : "Sorry, I did not catch that.  Could you ask your question again?"
        },
    }
};



const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'GoalNumber': function () {
            var closure = this;
            var finalData = '';
            var amount = '';
            var reponse = "";
            var askagain = "What else would you like to know ? ";
            
            getmydata({}, (data) =>{
                console.log(closure.event.request.intent.slots.School);
                if(closure.event.request.intent.slots.School && closure.event.request.intent.slots.School.value){
                    console.log(data);
                    console.log(closure.event.request.intent.slots.School);
                    console.log(closure.event.request.intent.slots.School.resolutions);
                    console.log(closure.event.request.intent.slots.School.resolutions.resolutionsPerAuthority[0].values);
                    var search = closure.event.request.intent.slots.School.resolutions.resolutionsPerAuthority[0].values[0].value.id;
                    
                    switch(search){
                        case "LW":
                            amount = "$" + data['entity']['LW']['ALL']['goalExact'];
                            response = "The Sandra Day O' Connor College of Law campaign goal is currently " + amount; 
                            closure.emit(":ask", response, askagain);
                        break;
                        default:
                        closure.emit(":ask", closure.t("NOT_SURE"), closure.t("WELCOME_REPROMPT"));
                        break;
                    }
                }else{
                    amount = "$" + data['entity']['ALL']['ALL']['goalExact'];
                    var response = "Our campaign overall goal is "  + amount;
                    closure.emit(":ask", response, askagain);
                }
            });
    },
    'ProgressNumber': function () {
            var closure = this;
            var finalData = '';
            var amount = '';
            var reponse = "";
            var askagain = "What else would you like to know ? ";
            
            getmydata({}, (data) =>{
                 if(closure.event.request.intent.slots.School && closure.event.request.intent.slots.School.value){
                    console.log(data);
                    console.log(closure.event.request.intent.slots.School);
                    console.log(closure.event.request.intent.slots.School.resolutions);
                    console.log(closure.event.request.intent.slots.School.resolutions.resolutionsPerAuthority[0].values);
                    var search = closure.event.request.intent.slots.School.resolutions.resolutionsPerAuthority[0].values[0].value.id;
                    
                    switch(search){
                        case "LW":
                            amount = "$" + data['entity']['LW']["ALL"]['progressExact'];
                            response = "The Sandra Day O' Connor College of Law campaign is currently at " + amount; 
                            closure.emit(":ask", response, askagain);
                        break;
                        default:
                        closure.emit(":ask", closure.t("NOT_SURE"), closure.t("WELCOME_REPROMPT"));
                        break;
                    }
                }else{
                    amount = "$" + data['entity']['ALL']['ALL']['progressExact'];
                    var response = "Our campaign overall is at "  + amount;
                    closure.emit(":ask", response, askagain);
                }
            });
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

function getmydata(mydata, callback){
    request.get('https://asucampaignprogress.asufoundation.org/Content/data/data.json',{
        'auth' : {
            'user' : "CampaignProgessBarApiDev\\$CampaignProgessBarApiDev",
            'pass' : "DBe7ZKZqXzkrlS4S7gKoFa1H8xbg5Wr5rPqHlChohnWLCnRSJwnsjKWFCEgC",
        }
    },
    function(err, response, body){
        callback(JSON.parse(body));
    });
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


