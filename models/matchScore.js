const mongoose = require('mongoose')

const MatchScoreSchema = new mongoose.Schema({
    Set:{
        type:Array
    },
    MatchID:{
        type:String
    },
    TeamA:{
        type:Object,
        TeamName:{
            type:String
        },
        TeamPlayers:{
            type:Array,
            maxlength:4
        }
    },
    TeamB:{
        type:Object,
        TeamName:{
            type:String
        },
        TeamPlayers:{
            type:Array,
            maxlength:4
        }
    },
    MatchStatus:{
        type:String,
        default:"NC"
    },
    MatchResult:{
        type:String
    },
    MatchDate:{
        type:String
    },
    MatchGender:{
        type:String
    }
},{timestamp:true});

const MatchScores = mongoose.model('matchscoring',MatchScoreSchema,'matchScores');
module.exports = MatchScores;