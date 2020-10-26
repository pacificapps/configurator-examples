import { Component, h, Event, EventEmitter, Host, Prop } from '@stencil/core';

import { IUser } from '../idlog-product-configurator/interfaces';

@Component({
  tag: 'intake-form',
  styleUrl: 'intake-form.css',
  shadow: true,
})
export class IntakeForm {
  @Prop() isOpen: boolean = false;

  @Prop() user: IUser = {};

  @Event() requestHide: EventEmitter<any>;

  @Event() requestSave: EventEmitter<IUser>;

  handleSubmit = (event: Event) => {
    const data = new FormData(event.target as HTMLFormElement);
    let payload = {};

    data.forEach((val, key) => {
      payload[key] = val;
    });

    this.requestSave.emit(payload);

    event.preventDefault();
  };

  handleCancel = event => {
    event.preventDefault();
    this.requestHide.emit();
  };

  render() {
    return (
      <Host aria-hidden={this.isOpen ? 'false' : 'true'} class={{ 'is-open': this.isOpen }}>
        <div class="dialog">
          <h1>Request a Quote</h1>
          <div class="subtitle">
            Fill in the form, and we’ll send you a personalized quote to your email
          </div>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label>First Name</label>
              <input type="text" name="firstName" value={this.user.firstName} />
            </p>
            <p>
              <label>Last Name</label>
              <input type="text" name="lastName" value={this.user.lastName} />
            </p>
            <p>
              <label>Email</label>
              <input type="text" name="email" value={this.user.email} />
            </p>
            <p>
              <label>Phone</label>
              <input type="text" name="phone" value={this.user.phone} />
            </p>
            <p>
              <label>Organization</label>
              <input type="text" name="organization" value={this.user.organization} />
            </p>
            <p>
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={this.user.postalCode} />
            </p>
            <p>
              <label>Comments</label>
              <textarea name="comments">{this.user.comments}</textarea>
            </p>
            <div class="buttons">
              <button onClick={this.handleCancel}>Cancel</button>
              <input type="submit" />
            </div>
          </form>
        </div>
      </Host>
    );
  }
}
