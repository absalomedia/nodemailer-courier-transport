import { CourierClient } from "@trycourier/courier";
import packageData from "../package.json";

const send = (courierSend: (arg0: any) => PromiseLike<{ messageId: any; }> | { messageId: any; }) => async ({ data: input }: any, callback: (arg0: unknown, arg1: { messageId: any; } | undefined) => void) => {
  try {
    const { messageId } = await courierSend(input);
    callback(null, { messageId });
  } catch (error) {
    callback(error);
  }
};

const outbound = (input: { email: string; to: string; list_id: string; list_pattern: any; }) => {
  const out = [];

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

const transport = (options: { apiKey: any; input: { data: any; brand_id: any; template: any; trace_id: any; provider: any; timeout: any; override: { bcc: any; cc: any; from: any; subject: any; reply_to: any; }; }; }) => {
  const courier = CourierClient({ authorizationToken: options.apiKey });

  const payload = {
    message: {
      to: outbound(options.input),
      routing: {
        method: "single",
        channels: ["email"],
      },
      data: { ...options.input.data },
      brand_id: options.input.brand_id,
      template: options.input.template,
      metadata: options.input.trace_id ? { trace_id: options.input.trace_id } : undefined,
      provider: options.input.provider,
      timeout: options.input.timeout ? { message: options.input.timeout } : undefined,
      override: options.input.override
        ? {
            channels: {
              email: {
                override: {
                  bcc: options.input.override.bcc,
                  cc: options.input.override.cc,
                  from: options.input.override.from,
                  subject: options.input.override.subject,
                  reply_to: options.input.override.reply_to,
                },
              },
            },
          }
        : undefined,
    },
  };

  const courierSend = courier.send({ payload });

  return {
    name: "Courier",
    version: packageData.version,
    send: send(courierSend),
  };
};

transport._send = send;

export default transport;