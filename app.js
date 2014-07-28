/*
 *                                                                  
 *  _  __                      _     
 * | |/ /                     | |    
 * | ' / ___ _   _ _ __  _   _| |__  
 * |  < / _ \ | | | '_ \| | | | '_ \ 
 * | . \  __/ |_| | |_) | |_| | |_) |
 * |_|\_\___|\__, | .__/ \__,_|_.__/ 
 *            __/ | |                
 *           |___/|_|                
 * 
 */

var console     = require('console'),
    app         = require('./config/app');

app.listen(app.get('port'), function() {
    console.log("Listening on " + app.get('port'));
});