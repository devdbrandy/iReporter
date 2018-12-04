const privateProps = new WeakMap();

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
    privateProps.set(this, { password: attributes.password });
    this.generateUsername();
  }

  generateUsername() {
    this.username = (
      this.lastname.substring(0, 5)
        + this.firstname.substring(0, 3)
        + Math.floor(Math.random() * 10)
    );
  }

  get password() {
    return privateProps.get(this).password;
  }

  update(data) {
    this.firstname = data.firstname || this.firstname;
    this.lastname = data.lastname || this.lastname;
    this.othernames = data.othernames || this.othernames;
    this.email = data.email || this.email;
    this.phoneNumber = data.phoneNumber || this.phoneNumber;
  }

  owns(resource) {
    return resource.createdBy === this.id;
  }

  toString() {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      othernames: this.othernames,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      registered: this.registered,
      isAdmin: this.isAdmin,
    };
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
    this.createdBy = attributes.createdBy;
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
      this.type = data.type || this.type;
      this.images = data.images || this.images;
      this.videos = data.videos || this.videos;
    }

    return this;
  }

  updateLocation(data) {
    if (this.status === 'draft') {
      this.location = data.location || this.location;
    }

    return this;
  }

  belongsTo({ id }) {
    this.createdBy = id;
  }

  toString() {
    return {
      id: this.id,
      createdOn: this.createdOn,
      type: this.type,
      location: this.location,
      comment: this.comment,
      images: this.images,
      videos: this.videos,
      status: this.status,
    };
  }

  static incrementCount() {
    Record.count += 1;
  }
}

User.count = 0;
Record.count = 0;
