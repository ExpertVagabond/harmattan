const SOURCES = [
  {
    name: "Vehicle Emissions",
    icon: "\u{1F697}",
    pct: 38,
    color: "#f87171",
    desc: "Aging vehicle fleet with minimal emission standards. Tro-tros and taxis in Accra and Kumasi are major contributors.",
  },
  {
    name: "Waste Burning",
    icon: "\u{1F525}",
    pct: 24,
    color: "#fb923c",
    desc: "Open burning of solid waste is widespread, especially in informal settlements and peri-urban areas.",
  },
  {
    name: "Harmattan Dust",
    icon: "\u{1F32C}\u{FE0F}",
    pct: 18,
    color: "#facc15",
    desc: "Saharan dust carried by dry northeast trade winds, Nov–Mar. PM10 levels spike dramatically during this season.",
  },
  {
    name: "Industrial",
    icon: "\u{1F3ED}",
    pct: 12,
    color: "#a855f7",
    desc: "Tema Industrial Area, mining operations in Ashanti, and cement factories contribute industrial particulates.",
  },
  {
    name: "Cooking Fuel",
    icon: "\u{1FAA8}",
    pct: 8,
    color: "#60a5fa",
    desc: "Biomass and charcoal cooking in households, especially in northern regions. A major indoor air quality concern.",
  },
];

export default function PollutionSources() {
  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Major Pollution Sources in Ghana
      </h3>
      <div className="space-y-4">
        {SOURCES.map((src) => (
          <div key={src.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{src.icon}</span>
                <span className="text-sm text-gray-200 font-medium">{src.name}</span>
              </div>
              <span className="text-xs font-mono text-gray-400">{src.pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${src.pct}%`, backgroundColor: src.color }}
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{src.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-600 mt-4 pt-3 border-t border-surface-700">
        Source: EPA Ghana Air Quality Report 2024 / World Bank estimates
      </p>
    </div>
  );
}
