import { z } from "zod";
import { CourierClient } from "@trycourier/courier";
import packageData from "../package.json";

type CourierSendFunction = (input: unknown) => Promise<{ messageId: string }>;

type SendCallback = (error: unknown, result?: { messageId: string }) => void;

type MessagePayload = {
  to: any[];
  routing: {
    method: "single";
    channels: string[];
  };
  data?: {
    [key: string]: unknown;
  };
  brand_id?: string;
  template?: string;
  provider?: string;
  timeout?: {
    message: number;
  };
};

type OverridePayload = {
  bcc?: string;
  cc?: string;
  from?: string;
  subject?: string;
  reply_to?: string;
};

type DataPayload = {
  email?: string;
  to?: string;
  list_id?: string;
  list_pattern?: string;
  data?: {
    [key: string]: unknown;
  };
  brand_id?: string;
  template?: string;
  trace_id?: string;
  provider?: string;
  timeout?: number;
  override?: OverridePayload;
};

type Payload = {
  message: MessagePayload & {
    data?: unknown
  };
};

type Options = {
  apiKey: string
}

const send = (courierSend: CourierSendFunction) => async (
  { data: input }: { data: DataPayload },
  callback: SendCallback
) => {
  try {
    const { messageId } = await courierSend(input);
    callback(null, { messageId });
  } catch (error) {
    callback(error);
  }
};

const outbound = (input: DataPayload) => {
  let out: { email?: string; user_id?: string; list_id?: string; list_pattern?: string }[] = [];

  if (input.email) {
    out.push({ email: input.email });
  }

  if (input.to) {
    out.push({ user_id: input.to });
  }

  if (input.list_id) {
    out.push({ list_id: input.list_id });
  }

  if (input.list_pattern) {
    out.push({ list_pattern: input.list_pattern });
  }

  return out;
};


const transport = (options: Options, input: DataPayload ) => {
  const courier = CourierClient({ authorizationToken: options.apiKey });

  const payload: Payload = {
    message: {
      to: outbound(input),
      routing: {
        method: "single",
        channels: ["email"],
      },
    },
  };

  if (input.data) {
    const dataPayload = input.data;
    payload.message.data = {
      ...dataPayload,
    };
  }

  if (input.brand_id) {
    const dataBrand = input.brand_id;
    payload.message.brand_id = dataBrand;
  }

  if (input.template) {
    const template = input.template;
    payload.message.template = template;
  }

  if (input.trace_id) {
    const trace = input.trace_id;
    // @ts-ignore
    payload.message.template = {
      metadata: {
        trace_id: trace,
      },
    };
  }

  if (input.provider) {
    const provider = input.provider;
    payload.message.provider = provider;
  }

  if (input.timeout) {
    const timeout = input.timeout;
    payload.message.timeout = {
      message: timeout,
    };
  }

  if (input.override) {
    if (input.override.bcc) {
      // @ts-ignore
      payload.message.channels.email.override.bcc = input.override.bcc;
    }

    if (input.override.cc) {
      // @ts-ignore
      payload.message.channels.email.override.cc = input.override.cc;
    }

    if (input.override.from) {
      // @ts-ignore
      payload.message.channels.email.override.from = input.override.from;
    }

    if (input.override.subject) {
      // @ts-ignore
      payload.message.channels.email.override.subject = input.override.subject;
    }

    if (input.override.reply_to) {
      // @ts-ignore
      payload.message.channels.email.override.reply_to = input.override.reply_to;
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

module.exports = transport