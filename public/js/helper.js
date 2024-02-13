var register = function(Handlebars) {
    // define helpers to devide outstanding order and fulfilled orders
    var helpers = {
        // isoutstanding helper to iterate over user's orders and display orderNum if the status is outstanding
        isoutstanding: function (orders) {
            var ret = "</ul>";
            for (var i=0, j=orders.length; i<j; i++) {
                if (orders[i].status === "outstanding") {
                    ret = ret + "<li>" + "<a href = \"/customer/order/" + orders[i].orderNum +"\">" +
                    "Order" + orders[i].orderNum + "</a></li>"
                } 
            }
            return ret + "</ul>";
        },

        // isoutstanding helper to iterate over user's orders and display orderNum if the status is fulfilled
        isfulfilled: function (orders) {
            var ret = "</ul>";
            for (var i=0, j=orders.length; i<j; i++) {
                if (orders[i].status === "fullfilled") {
                    ret = ret + "<li>" + "<a href = \"/customer/order/" + orders[i].orderNum +"\">" +
                    "Order" + orders[i].orderNum + "</a></li>"
                }  
            }
            return ret + "</ul>";
        },

        isoOrder: function(orders){
            var ret = "<ul id=\"container\">";
            for (var i=0, j=orders.length; i<j; i++) {
                if (orders[i].status === "outstanding" || (orders[i].status === "cancelled")) {
                    ret = ret + "<li>";
                    ret = ret + "<a href = \"/vendor/operate/" + orders[i].orderNum +"\">";
                    //console.log("test11");
                    
                    if(orders[i].status === "cancelled"){
                        //console.log("once");
                        ret = ret + "<div class = \"cancelled\">"
                        ret = ret + "<h1>" + orders[i].status +" No."+ orders[i].orderNum+ " Name:"+ orders[i].userName+"</h1>";
                        ret = ret + "<div id = \"ten-countdown\">"+"</div>"
                        ret = ret + "</div>"
    
                    }else{
                        if(orders[i].updated === "true"){
                            ret = ret + "<h1>" +"updated!" +" No."+ orders[i].orderNum+ " Name:"+ orders[i].userName+"</h1>";
                            
                        }else{
                            ret = ret + "<h1>" + " No." + orders[i].orderNum+ " Name:"+ orders[i].userName+"</h1>";      
                           
                        }
                    }
                    ret = ret + "<div class=\"new\">";
                    ret = ret + "<ul>";
                    for(var q=0,k=orders[i].content.length;q<k;q++){
                        ret = ret + "<li>" + "<p>" + orders[i].content[q].foodName + ": "+ orders[i].content[q].quantity+ "</p>" + "</li>"
                    }
                    ret = ret + "</ul> </div>" + "</a>" + "</li>";
                    // update to ready status
                    if(orders[i].status !== "cancelled"){                        
                        ret = ret + "<form method=\"post\" action=\"/vendor/orderr/"+orders[i].orderNum+"\"><button class=\"button button1\">Ready</button></form>";
                        //console.log("testr");
                    }
                }
        
            } 
            
            return ret + "</ul>";
        },
        
        // check whether is a pick-up order or not
        ispOrder: function (orders) {
            var ret = "<ul id=\"container\">";
            for (var i=0, j=orders.length; i<j; i++) {
                if (orders[i].status === "ready") {
                    ret = ret + "<li>";
                    ret = ret + "<a href = \"/vendor/operate/" + orders[i].orderNum +"\">";
                    ret = ret + "<h1>" + orders[i].status +" No."+ orders[i].orderNum+ " Name:"+ orders[i].userName+"</h1>";
                    ret = ret  + "</a>" + "</li>";
                    ret = ret + "<div class=\"new\">";
                    ret = ret + "<ul>";
                    for(var q=0,k=orders[i].content.length;q<k;q++){
                        ret = ret + "<li>" + "<p>" + orders[i].content[q].foodName + ": "+ orders[i].content[q].quantity+ "</p>" + "</li>"
                    }
                    // update to fulfilled status
                    ret = ret + "<form method=\"post\" action=\"/vendor/orderf/"+orders[i].orderNum+"\"><button class=\"button button1\">Fulfilled</button></form>";
                    //console.log("testful");
                }      
                
                
            }
            return ret + "</ul>";
        },

        // check whether is a fulfilled order or not
        isfOrder: function (orders) {
            var ret = "<ul>";
            for (var i=0, j=orders.length; i<j; i++) {
                if (orders[i].status === "fulfilled") {
                    ret = ret + "<li>";
                    ret = ret + "<a href=\"/vendor/orders/" + orders[i].orderNum +"\">";
                    ret = ret +orders[i].orderNum + " "+ orders[i].userName +" "+ orders[i].status+ " Discount: "+ orders[i].discounted;
                    ret = ret  + "</a>" + "</li>";
                } 
            }
            return ret + "</ul>";
        },

        // check whether is a cancelled order or not
        isdOrder: function (orders) {
            var ret = "<ul>";
            for (var i=0, j=orders.length; i<j; i++) {
                if (orders[i].status === "cancelled") {
                    ret = ret + "<li>";
                    ret = ret + "<a href=\"/vendor/orders/" + orders[i].orderNum +"\">";
                    ret = ret +orders[i].orderNum + " "+ orders[i].userName +" "+ orders[i].status+ " Discount: "+ orders[i].discounted;
                    ret = ret  + "</a>" + "</li>";
                } 
            }
            return ret + "</ul>";
        },

        // function used to countdown an order, if the time is up to 15 minutes, a 20% discount applied. 
        giveTime: function(order){
            var ret = "<div id=\"countdown\"></div>";
            //drawn inspiration from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
            var expiration = order.timeOrdered
            expiration.setMinutes(expiration.getMinutes()+15);
            // 15-minuters countdown
            ret = ret + "<script> var countDownTime ="+expiration.getTime()+";var x = setInterval(function() {var now = new Date().getTime(); var timeleft = countDownTime - now;var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);document.getElementById(\"countdown\").innerHTML =  \"Time remain:\" + minutes + \"m \" + seconds + \"s \";if (timeleft < 0) {clearInterval(x); document.getElementById(\"countdown\").innerHTML = \"Time is up!\" + \"<br>\" + \"20% discount is applied!\";}}, 1000);</script>"
            return ret;
        },

    };

    

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // for each helper defined above
        for (var prop in helpers) {
            // register helper using the registerHelper method
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }
    
};

// exports helpers to be used in the app
module.exports.register = register;
module.exports.helpers = register(null);