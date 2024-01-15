---
title: "Thoughts on migrating DNS from Netlify to Cloudflare"
summary: "DNS migration and open sourcing a tool used for it"
date: 2023-04-19T19:07:07+05:30
slug: "netlify-cloudflare"
tags:
- short
- dns
- draft
---


Recently, I was involved in the migration of a domain from [Netlify DNS](https://docs.netlify.com/domains-https/netlify-dns/) to [Cloudflare](https://www.cloudflare.com/dns/).
This short post describes my experiences and thoughts on it.

## Why Cloudflare?

<!-- Because it provides an easy to set up CDN and a reverse proxy. Netlify's DNS was very basic in comparison. -->
We were moving our static sites away from Netlify anyway and it did not make sense to keep it just for the basic DNS it provides.

Also because Cloudflare provides an easy to set up [CDN](https://www.cloudflare.com/cdn/) and a [reverse proxy](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/#proxied-records).

<!-- ## Why were you using Netlify for DNS anyway? -->

<!-- No idea. -->

## Why not Route53?

We have the rest of the infra on AWS, so [Route53](https://aws.amazon.com/route53/) would have made some things easier. But all eggs in one basket ¯\\\_(ツ)\_/¯

## How hard was it?

The hardest part was moving all of the DNS records. Cloudflare tries to scan for and [automatically add existing records](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/#review-dns-records), but it missed most of our records - especially CNAME records. It did get the MX records right.

The only way to add records - other than manually adding each one - is to use a [zone file](https://en.wikipedia.org/wiki/Zone_file). The problem now was that Netlify DNS could not export records to a zone file. What it did provide was an [API to list all records](https://open-api.netlify.com/#tag/dnsZone/operation/getDnsRecords). So I used the data from this API to programmatically generate a zone file.

I have open sourced this tool here: [**Netlify DNS Zone File Generator**](https://github.com/Samyak2/netlify-dns-zone-file)

Then we simply imported this zone file in Cloudflare. We changed the nameservers in our domain registrars to Cloudflare's and it took less than 30 mins for them to verify it - Cloudflare notes that this can take up to 24 hours.

Cloudflare enabled proxying by default for the imported records, so we did not have to do anything more to enable the CDN and reverse proxy. So all good then?

Nope. Our websites were not working in certain browsers - it showed an SSL/TLS error.

## Your website was down???

So Cloudflare has an SSL/TLS mode called "Flexible" which, apparently, "Encrypts traffic between the browser and Cloudflare". Turns out that it's not really flexible. It adds its own SSL/TLS on all proxied domains and that [caused a problem](https://community.cloudflare.com/t/cloudflare-all-time-classic-how-to-fix-error-code-ssl-error-no-cypher-overlap/314844). We changed the mode to "Full" which just means that the servers manage their own SSL/TLS.

I'm not really sure what the exact issue here was, but I would be interested in figuring it out.

