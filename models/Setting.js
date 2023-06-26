const { Schema, model, models } = require("mongoose");

const settingSchema = new Schema ({
    name: {type: String, require: true, unique: true},
    value: {type: Object}
}, {timestamps:true})

export const Setting = models?.Setting || model('Setting', settingSchema)