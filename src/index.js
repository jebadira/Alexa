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
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what is Campaign <say-as interpret-as='characters'>ASU</say-as> 20 20, or what is the goal of the campaign, I can even tell you our current progress toward goal ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask a question like, what is Campaign <say-as interpret-as='characters'>ASU</say-as> 20 20, or what is the goal of the campaign, I can even tell you our current progress toward goal ... Now, what can I help you with?",
            HELP_REPROMPT:  "You can ask a question like, what is Campaign <say-as interpret-as='characters'>ASU</say-as> 20 20, or what is the goal of the campaign, I can even tell you our current progress toward goal ... Now, what can I help you with?",
            STOP_MESSAGE: 'You\'re welcome. Together our potential is limitless!',
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
            var askagain = "What else would you like to know ? ";
            var response = "The goal of the Campaign <say-as interpret-as='characters'>ASU</say-as> 20 20 is <prosody volume='loud'>  at least</prosody> <break /> $1.5B";
            this.emit(":ask", response, askagain);
    },
    'ProgressNumber': function () {
            var closure = this;
            var amount = '';
            var askagain = "What else would you like to know ? ";
            
            getmydata({}, (data) =>{
                var percent = data['entity']['ALL']['ALL']['percentage'] + "%";
                amount = "$" + data['entity']['ALL']['ALL']['progressExact'];
                var response = "The current progress is " + amount + " and " + percent + " to goal.";
                closure.emit(":ask", response, askagain);
            });
    },
    'Information' : function(){
        this.emit(":ask", 
        "Campaign <say-as interpret-as='characters'>ASU</say-as> 20 20 is a strategic effort that focuses the entire university’s development energies on one goal <break strength='x-strong'  /> to permanently raise the long-term fundraising capacity of the university.",
         this.attributes.repromptSpeech)
    },
    "CampaignLaunch" : function(){
        this.emit(':ask', 
        "The public launch of Campaign <say-as interpret-as='characters'>ASU</say-as> 20 20 was <say-as interpret-as='date' format='mdy'>01 26 2017</say-as>",
        this.attributes.repromptSpeech);
    },
    'ThankYou':  function(){
        this.emit("SessionEndedRequest");
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


