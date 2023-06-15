#  nodemailer-courier-transport

  

##  Setup

  

To set up the basic architecture so you can send Nodemailer emails via Courier, start with the following code

  

```js
const nodemailer = require("nodemailer");

const courierTransport = require("nodemailer-courier-transport");

// This is your API key that you retrieve from courier.com account (free up to 10K monthly sends)

const auth = {
    apiKey: "ABCDEFGHIJKLMN",
};

const  nodemailerCourier  =  nodemailer.createTransport(courierTransport(auth));
```

Once this is set up, then you can set the various options available for your messaging and notifications using the SendMail function.

```js
nodemailerCourier.sendMail(
{
  template:  "courier-template-id",  // Configured in Courier UI
  brand_id:  "courier-brand-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
},

(err,  info)  =>  {
  if (err) {
  console.log(`Error: ${err}`);
  }  else  {
  console.log(`Response: ${info}`);
  }
}

);
```
  
## Recipients

There are multiple ways to send outbound. You can chain multiple types together too, so potential exists to send the same message to a unique email, a unique user and a list at the same time.

 - to an email	
 - to a user_id inside Courier
 - to a list created inside Courier
 - to a list pattern

```js
nodemailerCourier.sendMail(
  {
  to: "courier-user-id",  // Configured in Courier UI
  list_id:  "courier-list-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
  },
);
```



## Dynamic data
Courier Notification that have dynamic data can be specified of the SendMail function. You need to pass the all the data types as a data object.

```js
nodemailerCourier.sendMail(
  {
  email:  "recipient@domain.com",
  data: {
    name: "Recipient Name",
    link:"https://www.courier.com/"
    }
  },
);
```

## Template
Courier Notification templates can be set as part of the SendMail function. You should specify the unique template ID.

```js
nodemailerCourier.sendMail(
  {
  template: "courier-template-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
  data: {
    name: "Recipient Name",
    link:"https://www.courier.com/"
    }
  },
);
```


## Brand
Specifying a branded template design can be set as part of the SendMail function, referencing the Courier Notification brand ID. This will then be reflected across multiple templates being sent.

```js
nodemailerCourier.sendMail(
  {
  brand: "courier-brand-id",  // Configured in Courier UI
  template: "courier-template-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
  data: {
    name: "Recipient Name",
    link:"https://www.courier.com/"
    }
  },
);
```

## Overrides

The ability to override email base settings, whilst not having the fine grain control of provider based overrides, has been implemented.

These overrides cover:

- message subject 
- message from - email
- message bcc - email
- message cc - email
- message reply_to - email


```js
nodemailerCourier.sendMail(
  {
  template: "courier-template-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
  data: {
    name: "Recipient Name",
    link:"https://www.courier.com/"
    }
  },
  override: {
    from: "override@sender.domain",
    reply_to: "override@sender.domain",
    subject: "Overridden Subject",
    bcc: "new_bcc@sender.domain",
    cc: "new_cc@sender.domain",
  }
);
```

## Email tracing
You can enable email tracing as part of the SendMail function, referencing the Courier Notification metadata tracing ID.

```js
nodemailerCourier.sendMail(
  {
  template: "courier-template-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
  data: {
    name: "Recipient Name",
    link:"https://www.courier.com/"
    }
  },
  trace: "your-custom-trace-id"
);
```


## Timeouts
Message timeouts can be set as part of the SendMail function. It requires a number amount in seconds.

```js
nodemailerCourier.sendMail(
  {
  template: "courier-template-id",  // Configured in Courier UI
  email:  "recipient@domain.com",
  data: {
    name: "Recipient Name",
    link:"https://www.courier.com/"
    }
  },
  timeout: 3600
);
```

## Providers

You can send provider based overrides as an object to the SendMail function, allowing you to do domain specific variations as part of the messaging cycle.

As this is provider based overrides, please consult the Courier docs directly on this. This plugin aims to provide coverage for all the Courier messaging feature set, not replace it.

## Plugin development

There is a long term plan to move this to Typescript and use type validation using Zod to help gracefully manage input
