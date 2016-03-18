Messages = new Mongo.Collection("messages");

Router.route('/', function () {
    this.render('guestBook');
    this.layout('layout');
});

Router.route('/about', function () {
    this.render('about');
    this.layout('layout');
});

Router.route('/messages/:_id', function () {
        this.render('message', {
            data: function () {
                return Messages.findOne({_id: this.params._id});
            }
        });
        this.layout('layout');
    },
    {
        name: 'message.show'
    });


if (Meteor.isClient) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.subscribe("messages");

    Template.guestBook.helpers({
            "messages": function () {
                return Messages.find({}, {sort: {createdOn: -1}}) || {};
            }
        }
    );

    //template.guestbook
    Template.guestBook.events({
        "submit form": function (event) {
            event.preventDefault();

            var messageBox = $(event.target).find('textarea[name=guestBookMessage]');

            var messageText = messageBox.val();

            if (messageText.length > 0) {

                Messages.insert(
                    {
                        name: Meteor.user().username,
                        message: messageText,
                        createdOn: Date.now()
                    }
                );
            }
            else {
                alert("Please enter a message");
            }
        }
    });
}
if (Meteor.isServer) {

    Meteor.publish("messages", function () {
        return Messages.find();
    });
}
