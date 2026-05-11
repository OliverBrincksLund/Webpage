window.PORTFOLIO_CONTENT = {
  nav: {
    top: [
      { panel: "home", label: "Home", icon: "fa-solid fa-house", level: "root" }
    ],
    groups: [
      {
        label: "Software",
        icon: "fa-solid fa-code",
        items: ["sw-headanalyser", "sw-headanalyser-v2", "sw-gsa", "sw-datamerger", "sw-qgis"]
      },
      {
        label: "Projects",
        icon: "fa-solid fa-folder-open",
        items: ["proj-1", "proj-2", "proj-3", "proj-4"]
      },
      {
        label: "Academic",
        icon: "fa-solid fa-graduation-cap",
        items: ["proj-5", "proj-6", "proj-7"]
      }
    ],
    bottom: [
      { panel: "gallery", label: "Gallery", icon: "fa-solid fa-images", level: "root" },
      { panel: "about", label: "About & Contact", icon: "fa-solid fa-user", level: "root" }
    ]
  },
  panels: {
    "sw-headanalyser": {
      navLabel: "HeadAnalyser",
      navIcon: "fa-solid fa-water",
      navLevel: "sub",
      cardEyebrow: "Software",
      cardTitle: "HeadAnalyser",
      cardDescription: "Groundwater hydraulic-gradient analysis software developed at DTU Sustain, with a released V1 and a modular V2 rewrite in progress.",
      cardImage: "Images/software/headanalyser/hero.jpg",
      cardAlt: "HeadAnalyser interface preview"
    },
    "sw-headanalyser-v2": {
      navLabel: "V2 (in development)",
      navIcon: "fa-solid fa-code-branch",
      navLevel: "child"
    },
    "sw-gsa": {
      navLabel: "GrainSizeAnalysis",
      navIcon: "fa-solid fa-layer-group",
      navLevel: "sub"
    },
    "sw-datamerger": {
      navLabel: "DataMerger",
      navIcon: "fa-solid fa-database",
      navLevel: "sub",
      cardEyebrow: "Software",
      cardTitle: "DataMerger",
      cardDescription: "Desktop tooling for filtering, merging, spatial analysis, SQL connectivity, and interactive inspection of environmental datasets.",
      cardImage: "Images/software/datamerger/hero.jpg",
      cardAlt: "DataMerger interface preview"
    },
    "sw-qgis": {
      navLabel: "QGIS Program",
      navIcon: "fa-solid fa-map",
      navLevel: "sub",
      cardEyebrow: "Software",
      cardTitle: "QGIS Program",
      cardDescription: "Custom PyQGIS tooling for repeatable workflows, layout generation, and automated map export.",
      cardImage: "Images/software/qgis/hero.svg",
      cardAlt: "QGIS automation workflow overview"
    },
    "proj-1": {
      navLabel: "Regionernes overfladevand",
      navIcon: "fa-solid fa-droplet",
      navLevel: "sub",
      cardEyebrow: "Project",
      cardTitle: "Regionernes overfladevand",
      cardDescription: "Automated pipeline and QGIS cartography for groundwater contamination impacts on Danish regulated surface waters.",
      cardImage: "Images/projects/project-01/overview-all-regions.jpg",
      cardAlt: "Regional surface-water impact map"
    },
    "proj-2": {
      navLabel: "InSa-Drikkevand",
      navIcon: "fa-solid fa-flask-vial",
      navLevel: "sub",
      cardEyebrow: "Project",
      cardTitle: "InSa-Drikkevand",
      cardDescription: "Groundwater assessment work comparing national monitoring data with utility-specific PFAS and pesticide observations.",
      cardImage: "Images/projects/project-02/geus-national-freq.jpg",
      cardAlt: "InSa-Drikkevand monitoring comparison chart"
    },
    "proj-3": {
      navLabel: "Grundvandets kemiske påvirkning",
      navIcon: "fa-solid fa-mountain",
      navLevel: "sub"
    },
    "proj-4": {
      navLabel: "PFAS / pesticider beslutningstræer",
      navIcon: "fa-solid fa-triangle-exclamation",
      navLevel: "sub",
      cardEyebrow: "Project",
      cardTitle: "PFAS / pesticider beslutningstræer",
      cardDescription: "Active collaboration with GEUS and Miljøstyrelsen on PFAS and pesticide risk and state assessment workflows at groundwater-body level.",
      cardImage: "Images/projects/project-04/decision_tree_funnel.png",
      cardAlt: "PFAS and pesticide decision-tree workflow diagram"
    },
    "proj-5": {
      navLabel: "Sedimentary Microbial Fuel Cells",
      navIcon: "fa-solid fa-bolt",
      navLevel: "sub",
      cardEyebrow: "Bachelor Thesis · Colding Award 2022",
      cardTitle: "Sedimentary Microbial Fuel Cells",
      cardDescription: "Award-winning BSc thesis investigating SMFC technology for bioremediation of hypoxic marine sediments through cable bacteria and electrode optimisation.",
      cardImage: "Images/projects/project-05-bachelor-award/smfc-principle.jpg",
      cardAlt: "Sedimentary Microbial Fuel Cells concept figure"
    },
    "proj-6": {
      navLabel: "UV-A & Plant Growth",
      navIcon: "fa-solid fa-seedling",
      navLevel: "sub"
    },
    "proj-7": {
      navLabel: "MSc Thesis — Deep Learning QC",
      navIcon: "fa-solid fa-brain",
      navLevel: "sub"
    }
  },
  selectedWork: [
    "sw-headanalyser",
    "sw-datamerger",
    "sw-qgis",
    "proj-1",
    "proj-2",
    "proj-4",
    "proj-5"
  ],
  galleryItems: [
    {
      src: "Images/Gallery/Maps/map1.jpg",
      title: "JAR 173-00090 — Mølleå, PFAS exceedance",
      desc: "Site-specific exceedance map for Perfluoroktansyre (PFAS) at the Mølleå stream monitoring station near Copenhagen. Points are colour-coded by exceedance tier (>10× limit, above limit, above detection limit, below detection limit). V1/V2 contaminated site polygons overlaid.",
      project: "Regionernes overfladevand"
    },
    {
      src: "Images/Gallery/Maps/map10.jpg",
      title: "National stream contamination status",
      desc: "National overview of confirmed contamination status (Ja / Nej / Uafklaret) at all stream monitoring stations across Denmark, based on the regions' 2021-22 sampling campaigns near V1/V2 mapped contaminated sites.",
      project: "Regionernes overfladevand"
    },
    {
      src: "Images/Gallery/Maps/map6.jpg",
      title: "Nordjylland — landfill sites, multi-compound",
      desc: "Landfill sites in Nordjylland with confirmed stream contamination, showing multiple compound groups simultaneously using point displacement rendering. Blue = impact primarily from site; red = site plus other sources.",
      project: "Regionernes overfladevand"
    },
    {
      src: "Images/Gallery/Maps/map2.jpg",
      title: "Clay thickness over uppermost aquifer — national",
      desc: "National map of clay cover thickness (m) above the uppermost connected sand aquifer layer, derived from the DK-model. Overlaid with borehole classification (DEPOT, VF, GRUMO, Grundvandskortlægning). Raster colour scale from <2 m (light) to >50 m (dark brown).",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map3.jpg",
      title: "Clay thickness >50 m — national filter",
      desc: "Subset of the national clay thickness dataset filtered to areas where the clay cover exceeds 50 m (n=263). Shows borehole distribution in areas with deep clay protection over the aquifer.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map5.jpg",
      title: "TREFOR — pesticide exceedance across catchments",
      desc: "Pesticide monitoring results at intake points within TREFOR's drinking water catchments (Oplande), colour-coded by exceedance tier against the 0.1 µg/l groundwater quality criterion. Regulated streams overlaid.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map4.jpg",
      title: "NOVAFOS — Bagsværd wellfield and catchment",
      desc: "Wellfield map for NOVAFOS's Bagsværd kildeplads showing individual intake boreholes and the delineated catchment area (opland). Located northwest of Copenhagen near Furesø.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map7.jpg",
      title: "TREFOR — Hedensted wellfield, V1/V2 and stormwater",
      desc: "Hedensted kildeplads catchment showing V1 (suspected) and V2 (confirmed) contaminated sites, stormwater discharge points (regnbetingedeudløb), and treatment plants within the catchment boundary.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map8.jpg",
      title: "TREFOR — Solekær wellfield, land use",
      desc: "Land use classification map (GEUS/CLC) within the Solekær kildeplads catchment area, covering over 25 land use categories. Used to assess contamination risk from agricultural and urban land uses.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map9.jpg",
      title: "TREFOR — Staurbyskov, Desphenyl chloridazon",
      desc: "Exceedance map for Desphenyl chloridazon (a pesticide metabolite) at Staurbyskov kildeplads near Kolding. One intake exceeds 10× the quality criterion; one exceeds the limit value. Catchment boundary shown.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Maps/map11.jpg",
      title: "Geological cross-section — Copenhagen area",
      desc: "GeoAtlas A-A' geological profile near Avedøre Landsby showing subsurface stratigraphy: Upper Clay, Middle Sand, Lower Clay, Lower Sand, Lower Copenhagen Limestone, Bryozoan limestone, and Chalk. Borehole logs aligned along the profile.",
      project: "Geo.dk integration work"
    },
    {
      src: "Images/projects/project-04/tilstandsvurdering_map.png",
      title: "PFAS state-assessment map",
      desc: "Example national map from the active PFAS state-assessment workflow, showing how pre-screened groundwater bodies are routed into broad status classes for follow-up review.",
      project: "Risiko- og tilstandsvurdering for PFAS og pesticider"
    },
    {
      src: "Images/projects/project-04/volume_impact_geospatial_analysis.png",
      title: "Groundwater volume impact analysis",
      desc: "Risk-workflow output visualising potential affected-volume patterns across groundwater bodies using well chemistry, source areas, and geological raster data.",
      project: "Risiko- og tilstandsvurdering for PFAS og pesticider"
    },
    {
      src: "Images/projects/project-04/decision_tree_funnel.png",
      title: "PFAS decision-tree flow",
      desc: "Reporting figure tracing how groundwater bodies move through the active PFAS state-assessment logic from analysis coverage and exceedance checks to final categorisation.",
      project: "Risiko- og tilstandsvurdering for PFAS og pesticider"
    },
    {
      src: "Images/Gallery/Plots/plot6.jpg",
      title: "Top 10 pesticide compounds across water utilities",
      desc: "Heatmap showing the 10 most frequently detected pesticide compounds (above the detection limit, DG) across seven Danish water utilities. 2,6-Dichlorbenzamid and DMS are detected at all seven. Colour intensity reflects frequency; the red dashed line separates individual utilities from the total.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot7.jpg",
      title: "Top 10 PFAS at wellfields with ≥25% urban catchment",
      desc: "Ranked bar chart of the 10 most commonly detected PFAS compounds at wellfields where at least 25% of the catchment area is urban (bebyggelse). 6:2 FTS and PFBA are detected at 20 of the wellfields in this subset.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot8.jpg",
      title: "PFAS detection at Nybølle Øst (HOFOR)",
      desc: "Stacked bar chart showing the proportion of PFAS compounds detected above DG and above MKK at all 6 intakes of HOFOR's Nybølle Øst wellfield. SUM4 shows the highest exceedance rate; most long-chain PFAS are not detected.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot3.jpg",
      title: "Pesticide depth distribution — DEPOT boreholes, clay 0-1 m",
      desc: "Depth distribution of pesticide detections in DEPOT-type boreholes with <1 m clay cover. Shows proportion of intakes with detections above KV (limit), below KV, and not detected, binned by depth (m below surface). Detection rates are highest in the 0-30 m depth range.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot5.jpg",
      title: "Pesticide depth distribution — GEUS control boreholes",
      desc: "Depth distribution of pesticide detections in the national GEUS control borehole network, showing proportions above and below the quality criterion by depth interval. Provides a national baseline for comparison with individual water utility data.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot4.jpg",
      title: "Pesticide depth vs concentration — HOFOR",
      desc: "Scatter plot of pesticide concentration (µg/l) against intake depth (m) for HOFOR boreholes. DMS (N,N-Dimethylsulfamid) dominates detections. Points above 0.1 µg/l represent quality criterion exceedances. The vertical spread at shallow depths reflects the high density of shallow intakes.",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot1.jpg",
      title: "DIN Forsyning — pesticide detections vs national average",
      desc: "Bar chart comparing DIN Forsyning's pesticide detection rates (above DG and above KV) to the national average across all monitored compounds. Desphenyl chloridazon shows 19.1% more detections above DG than the national mean (24 detections).",
      project: "InSa-Drikkevand"
    },
    {
      src: "Images/Gallery/Plots/plot2.jpg",
      title: "Soil type composition per water utility",
      desc: "Normalised stacked bar chart of GEUS 1:25000 soil type (jordart) distribution within the catchments of seven Danish water utilities. Moræneler (ML) dominates TREFOR and VandCenterSyd catchments; Aalborg Forsyning has a high proportion of unknown layers (X).",
      project: "InSa-Drikkevand"
    }
  ]
};
