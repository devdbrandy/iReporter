export class User {
  constructor(attributes) {
    User.incrementCount();
    this.id = User.count;
    this.firstname = attributes.firstname;
    this.lastname = attributes.lastname;
    this.othernames = attributes.othernames;
    this.email = attributes.email;
    this.phoneNumber = attributes.phoneNumber;
    this.registered = Date();
    this.isAdmin = false;
    this.generateUsername();
  }

  generateUsername() {
    this.username = (
      this.lastname.substring(0, 5)
        + this.firstname.substring(0, 3)
        + Math.floor(Math.random() * 10)
    );
  }

  update(data) {
    this.firstname = data.firstname || this.firstname;
    this.lastname = data.lastname || this.lastname;
    this.othernames = data.othernames || this.othernames;
    this.email = data.email || this.email;
    this.phoneNumber = data.phoneNumber || this.phoneNumber;
  }

  adminPrivilege(value) {
    this.isAdmin = value;
  }

  static assignAdmin(user) {
    user.adminPrivilege(true);
  }

  static incrementCount() {
    User.count += 1;
  }
}

export class Record {
  constructor(attributes) {
    Record.incrementCount();
    this.id = Record.count;
    this.creadedOn = Date();
    this.createdBy = attributes.author;
    this.type = attributes.type;
    this.location = attributes.location;
    this.comment = attributes.comment;
    this.images = attributes.images;
    this.videos = attributes.videos;
    this.status = 'draft';
  }

  update(data) {
    if (this.status === 'draft') {
      this.comment = data.comment || this.comment;
      this.location = data.location || this.location;
      this.type = data.type || this.type;
      this.images = data.images || this.images;
      this.videos = data.videos || this.videos;
    }

    return this;
  }

  publish() {
    this.status = 'published';
  }

  static incrementCount() {
    Record.count += 1;
  }
}

User.count = 0;
Record.count = 0;
