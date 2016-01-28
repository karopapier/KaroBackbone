var User = require('../src/model/User');
var UserFactory = require('../src/factory/UserFactory');
exports.getUser = function(test) {

    var uf = new UserFactory();
    var u1 = uf.getUser(1);
    var u2 = uf.getUser(1);
    var u_ = uf.getUser(12);

    var ux = uf.getUser({
        name: "Dada",
        id: 1
    });

    test.expect(4);

    test.strictEqual(u1, u2);
    test.notStrictEqual(u1, u_);
    test.strictEqual(u1, ux);
    test.equal(u1.get("name"), "Dada", "getting a user with data sets the data as well");

    test.done();
};

exports.getSelfUser = function(test) {

    test.expect(5);

    var uf = new UserFactory();
    var loginUser = new User({
        id: 1,
        name: "Didi"
    });

    uf.setLogin(loginUser);
    var u1_1 = uf.getUser(1);
    var u1_2 = uf.getUser(1);
    var u12 = uf.getUser(12);


    test.equals(u1_1.get("self"), true, "user id 1 is self");
    test.equals(u1_2.get("self"), true, "user id 1 is self");
    test.equals(u12.get("self"), false, "user id 12 is not self");

    var u12_2 = uf.getUser({
        name: "Dada",
        id: 12
    });
    uf.setLogin(u12_2);

    test.equals(u1_1.get("self"), false, "self is updated when user changes");
    test.equals(u12.get("self"), true, "self is updated when user changes");

    test.done();
};

exports.userIdChanged = function(test) {
    test.expect(3);

    var u = new User();
    var uf = new UserFactory();
    uf.setLogin(u);

    var u1 = uf.getUser(1);
    test.equals(u1.get("self"), false, "self is false while not logged in");

    u.set("id", 1);
    test.equals(u1.get("self"), true, "self is true after id of login user changed");

    u.set("id", 0);
    test.equals(u1.get("self"), false, "self is false after logout");

    test.done();
};
