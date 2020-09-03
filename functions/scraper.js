/**
 * required modules
 */
const base = require('./commandsBase');
const puppeteer = require('puppeteer');
const $ = require('cheerio');

/**
 * 
 * @param {string} url 
 * @param {number} guild_id 
 * @param {boolean} isHome 
 */
function getPage(url, guild_id, channelId, isHome) {
    return new Promise(function (resolve) {
        var team_tag = '';
        var team_name = '';
        var team_logo = '';

        puppeteer.launch({ args: ['--no-sandbox']})
        .then((browser) => {
            return browser.newPage();
        })
        .then((page) => {
            page.goto(url)
            .then(() => {
                return page.content();
            })
            .then((content) => {
                $('#team_logo', content).each(function() {
                    var logo_obj = $(this);
                    if (logo_obj != undefined) {
                        team_logo = logo_obj[0].attribs.style.split('"')[1];
                    }
                });
        
                $('.team_tag', content).each(function() {
                    var tag_obj = $(this);
                    if (tag_obj != undefined) {
                        team_tag = tag_obj[0].childNodes[0].data;
                    }
                });
        
                $('.team_name', content).each(function() {
                    var name_obj = $(this);
                    if (name_obj != undefined) {
                        team_name = name_obj[0].childNodes[0].data;
                    }
                });
    
                var sql_update_string = '';
                if (isHome) {
                    sql_update_string = 'UPDATE ' + base.query.dbName + '.user_data SET home_mkc_link = "' + url + '", home_name = "' + team_name + '", home_tag = "' + team_tag + '", home_img = "' + team_logo + '", last_updated = now() WHERE guild_id = ' + guild_id + ' AND channel_id = ' + channelId + ';';
                }
                else {
                    sql_update_string = 'UPDATE ' + base.query.dbName + '.user_data SET guest_mkc_link = "' + url + '", guest_name = "' + team_name + '", guest_tag = "' + team_tag + '", guest_img = "' + team_logo + '", last_updated = now() WHERE guild_id = ' + guild_id + ' AND channel_id = ' + channelId + ';';
                }
                base.log.logMessage('puppeteer completely done...' + team_name);
                base.query.execute(sql_update_string)
                .then((result) => {
                    if (result.error != null) {
                        resolve({
                            tag: team_tag,
                            name: team_name,
                            logo: team_logo,
                            error: 'Loading clan-metadata failed!\n\nPlease try again. [01]',
                            debug_error: result.debug_error
                        });
                    }
                    resolve({
                        tag: team_tag,
                        name: team_name,
                        logo: team_logo,
                        error: null,
                        debug_error: null
                    });
                })
                .catch((err) => {
                    base.log.logMessage('SQL-ERROR:\n' + err);
                });
            })
            .catch(function(err) {
                resolve({
                    tag: team_tag,
                    name: team_name,
                    logo: team_logo,
                    error: 'Loading clan-metadata failed!\n\nPlease try again. [02]',
                    debug_error: err
                });
            });
        })
        .catch(function(err) {
            resolve({
                tag: team_tag,
                name: team_name,
                logo: team_logo,
                error: 'Loading clan-metadata failed!\n\nPlease try again. [03]',
                debug_error: err
            });
        });
    });
}

// --------------------------------------------------

module.exports = {
    getPage
};