var MapRenderPalette = Backbone.Model.extend({
    defaults: {
        'road': "128,128,128",
        'roadspecle': "100,100,100",
        'offroad': "0,200,0",
        'offroadspecle': "0,180,0",
        'offroadsand': "230,230,115",
        'offroadsandspecle': "200,200,100",
        'offroadmud': "100,70,0",
        'offroadmudspecle': "90,60,0",
        'offroadmountain': "100,100,100",
        'offroadmountainspecle': "0,0,0",
        'offroadwater': "0,60,200",
        'offroadwaterspecle': "0,30,100",
        'start1': "200,200,200",
        'start2': "100,100,100",
        'finish1': "255,255,255",
        'finish2': "0,0,0",
        'checkpoint1': "000,102,255", //Checkpoint 1
        'checkpoint2': "000,100,200", //Checkpoint 2
        'checkpoint3': "000,255,102", //Checkpoint 3
        'checkpoint4': "000,200,000", //Checkpoint 4
        'checkpoint5': "255,255,000", //Checkpoint 5
        'checkpoint6': "200,200,000", //Checkpoint 6
        'checkpoint7': "255,000,000", //Checkpoint 7
        'checkpoint8': "200,000,000", //Checkpoint 8
        'checkpoint9': "255,000,255", //Checkpoint 9
        'checkpointBgOdd': "0,0,0",
        'checkpointBgEven': "255,255,255",
        'fog': "0,0,0",
        'fogspecle': "0,0,0",
        'parc': "200,200,200"
    },
    initialize: function () {
        _.bindAll(this, "setAlias", "getRGB");
        this.setAlias();
        this.bind("change", this.setAlias);
    },
    setAlias: function () {
        var alias = {
            "O": "road",
            "Ospecle": "roadspecle",
            "offroadmountain": "V",
            'V': 'offroadmountain',
            'Vspecle': 'offroadmountainspecle',
            'W': 'offroadwater',
            'Wspecle': 'offroadwaterspecle',
            'X': 'offroad',
            'Xspecle': 'offroadspecle',
            'Y': 'offroadsand',
            'Yspecle': 'offroadsandspecle',
            'Z': 'offroadmud',
            'Zspecle': 'offroadmudspecle',
            '.': 'fog',
            '.specle': 'fogspecle',
        };

        for (a in alias) {
            origin = alias[a];
            this.set(a, this.get(origin));
        }
    },
    getRGB: function (field) {
        return "rgb(" + this.get(field) + ")";
    }
});
