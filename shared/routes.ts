import { z } from 'zod';
import { insertUserSchema, insertProfileSchema, insertLinkSchema, users, profiles, links } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  profiles: {
    me: {
      method: 'GET' as const,
      path: '/api/profile/me',
      responses: {
        200: z.custom<typeof profiles.$inferSelect & { links: typeof links.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/profile',
      input: insertProfileSchema.partial(),
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    getByUsername: {
      method: 'GET' as const,
      path: '/api/public/profile/:username',
      responses: {
        200: z.custom<typeof profiles.$inferSelect & { links: typeof links.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  links: {
    list: {
      method: 'GET' as const,
      path: '/api/links',
      responses: {
        200: z.array(z.custom<typeof links.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/links',
      input: insertLinkSchema,
      responses: {
        201: z.custom<typeof links.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/links/:id',
      input: insertLinkSchema.partial(),
      responses: {
        200: z.custom<typeof links.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/links/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    reorder: {
      method: 'POST' as const,
      path: '/api/links/reorder',
      input: z.array(z.object({ id: z.number(), order: z.number() })),
      responses: {
        200: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
