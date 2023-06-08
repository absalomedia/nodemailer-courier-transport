const { CourierClient } = require("@trycourier/courier");
const packageData = require("../package.json");

const send = courierSend => async ({ data: input }, callback) => {
  try {
    const { messageId } = await courierSend(input);
    callback(null, { messageId });
  } catch (error) {
    callback(error);
  }
};

const outbound = (input) => {
  let out = []

  if (input.email) {
    out.push({ email: input.email })
  }

  if (input.to) {
    out.push({ user_id: input.to })
  }

  if (input.list_id) {
    out.push({ list_id: input.list_id })
  }

  if (input.list_pattern) {
    out.push({ list_pattern: input.list_pattern })
  }

  return out
}

const transport = (options) => {
  const courier = CourierClient({ authorizationToken: options.apiKey });

  let payload = {
    message: {
      to: outbound(input),
      routing: {
        method: "single",
        channels: ["email"],
      },
    }
  }

  if (input.data) {
    const dataPayload = input.data
    payload.message.data = {
      dataPayload
    }
  }

  if (input.brand_id) {
    const dataBrand = input.brand_id
    payload.message.brand_id = dataBrand
  }

  if (input.template) {
    const template = input.template
    payload.message.template = template
  }

  if (input.trace_id) {
    const trace = input.trace_id
    payload.message.template = {
      metadata: {
        trace_id: trace
      }
    }
  }

  if (input.provider) {
    const provider = input.provider
    payload.message.provider = provider
  }

  if (input.timeout) {
    const timeout = input.timeout
    payload.message.timeout = {
      message: timeout
    }
  }

  if (input.override) {

    if (input.override.bcc) {
      payload.message.channels.email.override.bcc = input.override.bcc
    }

    if (input.override.cc) {
      payload.message.channels.email.override.cc = input.override.cc
    }

    if (input.override.from) {
      payload.message.channels.email.override.from = input.override.from
    }

    if (input.override.subject) {
      payload.message.channels.email.override.subject = input.override.subject
    }

    if (input.override.reply_to) {
      payload.message.channels.email.override.reply_to = input.override.reply_to
    }

  }
      
  const courierSend = courier.send({ payload });

  return {
    name: "Courier",
    version: packageData.version,
    send: send(courierSend),
  };
};

transport._send = send;

module.exports = transport;
