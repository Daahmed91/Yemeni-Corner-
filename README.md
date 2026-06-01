# Yemeni Corner Shopify Theme

Premium Shopify Online Store 2.0 theme for Yemeni Corner, built as a coffee-first storefront for the launch of **Yemeni Corner Signature Roast**.

## What Is Included

- From-scratch Shopify theme structure: `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, and `templates`.
- JSON templates for home, product, collection, pages, blog, article, cart, search, 404, policies, password, and list-collections.
- Alternate page templates for:
  - `page.story.json`
  - `page.menu.json`
  - `page.locations.json`
  - `page.contact.json`
- Premium Yemeni Corner design system using Heritage Gold, Deep Coffee Brown, Cream Sand, Charcoal Gray, and Warm White.
- Sections for hero, signature product, story, brewing guide, cafe menu, locations, testimonials, FAQ, newsletter, contact, and core commerce pages.
- Production design pass with responsive editorial layouts, premium product staging, richer hover/focus states, mobile drawer accessibility, structured data, and Shopify package hygiene.

## Required Store Setup

### Product

Create one product in Shopify admin:

- Product title: `Yemeni Corner Signature Roast`
- Product type: `Premium Yemeni Coffee`
- Size: `340 g`
- Format: `Whole Bean Coffee`
- Tasting notes: `Warm spice, cocoa, dried fruit`
- Roast level: `Medium`
- Best for: `Drip, French press, pour-over, espresso`
- Description:

```text
A rich and aromatic coffee inspired by Yemen's deep coffee heritage. Smooth, warm, and full of character, this roast is made for slow mornings, family gatherings, and anyone looking for a coffee with a story.
```

Add product photography when available. The theme includes a branded coffee bag placeholder for development only.

For a polished launch, use:

- One clean product packshot on warm neutral background.
- One lifestyle image with brewed coffee, dates, or a home ritual setting.
- One cafe or hospitality image for story/location sections.
- Consistent alt text that describes the subject, not just the brand.

### Collection

Create a collection for the shop page:

- Collection title: `Shop Coffee`
- Suggested handle: `coffee`
- Include the Signature Roast product.

If you want the header `Shop Coffee` link to go directly to this collection, update the main menu link in Shopify admin.

### Pages

Create these pages and assign the matching templates:

- `Story` -> template `page.story`
- `Menu` -> template `page.menu`
- `Locations` -> template `page.locations`
- `Contact` -> template `page.contact`

The templates already include polished section content, so the page body can stay minimal at launch.

### Navigation

Create or update the `main-menu` navigation:

- Home
- Shop Coffee
- Story
- Menu
- Locations
- Journal
- Contact

Create or update the `footer` navigation with the same core links plus policies.

### Markets, Shipping, And Tax

For v1, configure these in Shopify admin:

- Market: Canada only
- Shipping zones: Canada only
- Taxes: Shopify-managed Canada tax setup
- Subscriptions: disabled for v1
- Cafe menu ordering: not enabled in this theme

## Local Development

This machine did not have Ruby, Theme Check, or Shopify CLI available when the theme was scaffolded. Install Shopify CLI before previewing:

```powershell
npm install -g @shopify/cli @shopify/theme
shopify version
```

Then run:

```powershell
shopify theme check
shopify theme dev --store your-store.myshopify.com
```

To upload as an unpublished theme:

```powershell
shopify theme push --unpublished --store your-store.myshopify.com
```

## QA Checklist

- Run `shopify theme check`.
- Preview home, product, collection, cart, story, menu, locations, contact, blog, article, search, and 404 pages.
- Test add to cart, quantity updates, cart note, checkout handoff, and empty cart state.
- Check mobile navigation, keyboard focus, form labels, color contrast, and image alt text.
- Replace development placeholder imagery with final product and lifestyle photography before launch.
- Verify Product and WebSite structured data in a rich results validator after the theme is connected to the live Shopify domain.
- Confirm `*.zip`, `.env`, local Shopify state, and development-only files are excluded before pushing the theme.
