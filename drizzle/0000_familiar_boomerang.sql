CREATE TABLE "case_services" (
	"case_slug" text NOT NULL,
	"service_slug" text NOT NULL,
	CONSTRAINT "case_services_case_slug_service_slug_pk" PRIMARY KEY("case_slug","service_slug")
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"challenge" text NOT NULL,
	"approach" text NOT NULL,
	"outcome" text NOT NULL,
	"technologies" text[] NOT NULL,
	"primary_service" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"sort" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_evidence" (
	"case_slug" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" uuid NOT NULL,
	"payload_hash" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"brief" text NOT NULL,
	"service" text,
	"project" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inquiries_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "inquiry_rate_windows" (
	"bucket" text NOT NULL,
	"window" integer NOT NULL,
	"count" integer NOT NULL,
	CONSTRAINT "inquiry_rate_windows_bucket_window_pk" PRIMARY KEY("bucket","window")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"sort" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "case_services" ADD CONSTRAINT "case_services_case_slug_case_studies_slug_fk" FOREIGN KEY ("case_slug") REFERENCES "public"."case_studies"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_services" ADD CONSTRAINT "case_services_service_slug_services_slug_fk" FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_primary_service_services_slug_fk" FOREIGN KEY ("primary_service") REFERENCES "public"."services"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_evidence" ADD CONSTRAINT "case_evidence_case_slug_case_studies_slug_fk" FOREIGN KEY ("case_slug") REFERENCES "public"."case_studies"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_service_services_slug_fk" FOREIGN KEY ("service") REFERENCES "public"."services"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_project_case_studies_slug_fk" FOREIGN KEY ("project") REFERENCES "public"."case_studies"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_project_service_case_services_case_slug_service_slug_fk" FOREIGN KEY ("project","service") REFERENCES "public"."case_services"("case_slug","service_slug") ON DELETE no action ON UPDATE no action;