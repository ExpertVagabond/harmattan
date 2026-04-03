import {
  Grid, Column, Tile, ClickableTile, Tag, UnorderedList, ListItem,
  Accordion, AccordionItem,
} from "@carbon/react";
import { Launch, LogoGithub } from "@carbon/react/icons";

export default function AboutPage() {
  return (
    <Grid>
      <Column lg={10} md={6} sm={4}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: 8, color: "#f4f4f4" }}>
          About Harmattan
        </h1>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <Tag type="warm-gray" size="sm">Tech Hub Africa Hackathon 2026</Tag>
          <Tag type="orange" size="sm">Pollution Control Track</Tag>
          <Tag type="green" size="sm">Open Source</Tag>
        </div>

        <Tile style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f4f4f4", marginBottom: 12 }}>
            The Problem
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#a8a8a8", lineHeight: 1.7 }}>
            Ghana faces a growing air quality crisis. Urban centers like Accra and Kumasi experience
            pollution levels that regularly exceed WHO guidelines by 3-5x. During harmattan season
            (November to March), Saharan dust compounds the problem, pushing AQI readings into
            unhealthy and hazardous territory.
          </p>
          <p style={{ fontSize: "0.875rem", color: "#a8a8a8", lineHeight: 1.7, marginTop: 12 }}>
            Yet most Ghanaians have no access to real-time air quality data. There are fewer than
            20 professional monitoring stations across the entire country. Communities near industrial
            zones, waste burning sites, and congested roads have no way to know when the air they
            breathe is dangerous.
          </p>
        </Tile>

        <Tile style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f4f4f4", marginBottom: 12 }}>
            Our Solution
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#a8a8a8", lineHeight: 1.7 }}>
            Harmattan is a real-time air quality monitoring platform built specifically for Ghana.
            It aggregates data from international monitoring networks (WAQI, OpenAQ) and supplements
            it with community-sourced pollution reports to create the most comprehensive picture of
            Ghana's air quality.
          </p>
          <UnorderedList style={{ marginTop: 12 }}>
            <ListItem>Real-time AQI monitoring for 6 major Ghanaian cities</ListItem>
            <ListItem>Interactive pollution map with severity indicators</ListItem>
            <ListItem>Health advisories tailored to local conditions</ListItem>
            <ListItem>24-hour pattern analysis and seasonal trend tracking</ListItem>
            <ListItem>Community reporting system for citizen-sourced data</ListItem>
            <ListItem>Pollution source breakdown with Ghana-specific context</ListItem>
          </UnorderedList>
        </Tile>

        <Accordion>
          <AccordionItem title="Technical Architecture">
            <div style={{ fontSize: "0.8125rem", color: "#a8a8a8", lineHeight: 1.7 }}>
              <p><strong style={{ color: "#f4f4f4" }}>Frontend:</strong> React 19 + Carbon Design System (IBM) + TypeScript</p>
              <p><strong style={{ color: "#f4f4f4" }}>Visualization:</strong> Custom Canvas particle system, SVG radial gauges, heatmaps</p>
              <p><strong style={{ color: "#f4f4f4" }}>Maps:</strong> Leaflet with CartoDB dark tiles + animated markers</p>
              <p><strong style={{ color: "#f4f4f4" }}>Data:</strong> WAQI API + OpenAQ API for real-time monitoring data</p>
              <p><strong style={{ color: "#f4f4f4" }}>Hosting:</strong> Cloudflare Pages — global edge network, zero cold starts</p>
              <p><strong style={{ color: "#f4f4f4" }}>Build:</strong> Vite 7 — sub-2s builds, optimized code splitting</p>
            </div>
          </AccordionItem>
          <AccordionItem title="Data Sources">
            <div style={{ fontSize: "0.8125rem", color: "#a8a8a8", lineHeight: 1.7 }}>
              <p><strong style={{ color: "#f4f4f4" }}>WAQI (World Air Quality Index):</strong> Global network covering 30,000+ stations. Provides real-time AQI, PM2.5, PM10, NO2, SO2, CO, and O3 readings.</p>
              <p style={{ marginTop: 8 }}><strong style={{ color: "#f4f4f4" }}>OpenAQ:</strong> Open-source platform aggregating government air quality data from 160+ countries including Ghana EPA stations.</p>
              <p style={{ marginTop: 8 }}><strong style={{ color: "#f4f4f4" }}>Community Reports:</strong> Citizen-sourced observations that fill gaps in official monitoring coverage.</p>
              <p style={{ marginTop: 8 }}><strong style={{ color: "#f4f4f4" }}>Baseline Estimates:</strong> When live APIs are unavailable, we show EPA Ghana baseline data to ensure the dashboard is always informative.</p>
            </div>
          </AccordionItem>
          <AccordionItem title="Scalability & Future Plans">
            <div style={{ fontSize: "0.8125rem", color: "#a8a8a8", lineHeight: 1.7 }}>
              <p>Harmattan's architecture is designed to scale across Africa:</p>
              <UnorderedList style={{ marginTop: 8 }}>
                <ListItem>Add new countries by configuring city data — no code changes needed</ListItem>
                <ListItem>IoT sensor integration via DePIN (Decentralized Physical Infrastructure) incentive layer</ListItem>
                <ListItem>Push notifications for hazardous air quality events</ListItem>
                <ListItem>Historical data storage with D1 (Cloudflare's edge database)</ListItem>
                <ListItem>Machine learning predictions for next-day AQI forecasting</ListItem>
                <ListItem>Multilingual support (Twi, Ga, Hausa, Ewe)</ListItem>
              </UnorderedList>
            </div>
          </AccordionItem>
        </Accordion>
      </Column>

      <Column lg={6} md={2} sm={4}>
        <ClickableTile
          href="https://github.com/ExpertVagabond/harmattan"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginBottom: 16, padding: 20 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LogoGithub size={20} />
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f4f4f4" }}>
              View Source Code
            </span>
            <Launch size={16} style={{ marginLeft: "auto", color: "#8d8d8d" }} />
          </div>
          <p style={{ fontSize: "0.75rem", color: "#8d8d8d" }}>
            ExpertVagabond/harmattan — MIT License
          </p>
        </ClickableTile>

        <Tile style={{ padding: 20, marginBottom: 16 }}>
          <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 12 }}>
            Hackathon Track
          </h4>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#ec8b1e", marginBottom: 4 }}>
            Pollution Control
          </p>
          <p style={{ fontSize: "0.75rem", color: "#8d8d8d" }}>
            Creating sustainable solutions for a cleaner, healthier urban environment.
          </p>
        </Tile>

        <Tile style={{ padding: 20 }}>
          <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#c6c6c6", marginBottom: 12 }}>
            Why "Harmattan"?
          </h4>
          <p style={{ fontSize: "0.8125rem", color: "#a8a8a8", lineHeight: 1.7 }}>
            The Harmattan is a dry, dusty trade wind that blows from the Sahara across West Africa
            from late November to mid-March. It carries fine particulate matter thousands of
            kilometers, creating the most severe air quality events in Ghana's annual cycle.
          </p>
          <p style={{ fontSize: "0.8125rem", color: "#a8a8a8", lineHeight: 1.7, marginTop: 8 }}>
            We named this platform after the problem it was built to make visible — because you
            can't fix what you can't measure.
          </p>
        </Tile>
      </Column>
    </Grid>
  );
}
