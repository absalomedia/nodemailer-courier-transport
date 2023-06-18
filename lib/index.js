var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z } from "zod";
import { CourierClient } from "@trycourier/courier";
import packageData from "../package.json";
const Options = z.object({
    apiKey: z.string(),
});
const send = (courierSend) => ({ data: input }, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = yield courierSend(input);
        callback(null, { messageId });
    }
    catch (error) {
        callback(error);
    }
});
const outbound = (input) => {
    let out = [];
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
// Usage example
const options = {
    apiKey: "YOUR_API_KEY",
};
const inputSchema = z.object({
    data: z.record(z.unknown()).optional(),
    brand_id: z.string().optional(),
    template: z.string().optional(),
    trace_id: z.string().optional(),
    provider: z.string().optional(),
    timeout: z.number().optional(),
    override: z.object({
        bcc: z.string().optional(),
        cc: z.string().optional(),
        from: z.string().optional(),
        subject: z.string().optional(),
        reply_to: z.string().optional(),
    }).optional(),
});
const transport = (options, input) => {
    const courier = CourierClient({ authorizationToken: options.apiKey });
    const payload = {
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
        payload.message.data = Object.assign({}, dataPayload);
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
module.exports = transport;
