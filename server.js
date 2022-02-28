var http = require('http');
var url = require('url');
const youtubedl = require('youtube-dl-exec');

http.createServer((req,res) => {
    res.writeHead(200,{'Content-Type': 'application/json'});
    var q = url.parse(req.url,true);
    var regex = /[/]{1}youtube([a-zA-Z0-9?&=]+)/gi;
    var jsondata = JSON.stringify({});
    if( q.path.match(regex) !== null ){
        var videoid = q.query.v;
        var videourl = "https://www.youtube.com/watch?v=" + videoid;
        var tags = {
            '1080p': "1080p",
            "1080": "1080p",
            "1080p60": "1080p",
            '720p': "720p",
            "720": "720p",
            "720p60": "720p",
            "480p": "480p",
            "480": "480p",
            "360p": "360p",
            "360": "360p",
            "tiny": "tiny",
        };
        var video = { '360p': ["",""], '480p': ["",""], '720p': ["",""], '1080p': ["",""] };
        youtubedl(videourl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
            referer: videourl
        }).then(output => {
            for( var i = 0 ; i < output.formats.length ; i++ ){
                var format = tags[output.formats[i].format_note];
                if( format === "1080p" || format === "720p" || format === "480p" || format === "360p" ){
                    if( output.formats[i].acodec !== 'none' ){
                        video[format][0] = output.formats[i].url;
                        video[format][1] = "";
                    }
                    else if( video[format][0] === "" ){
                        video[format][0] = output.formats[i].url;
                    }
                }
                else if( format === 'tiny' ){
                    video['1080p'][1] = video['720p'][1] = video['480p'][1] = video['360p'][1] = output.formats[i].url;
                }
            }
            jsondata = JSON.stringify(video);
            res.end(jsondata);
        })
    }
}).listen(6900);
