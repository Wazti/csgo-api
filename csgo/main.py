from csgo.parser import DemoParser

# Create parser object
# Set log=True above if you want to produce a logfile for the parser
demo_parser = DemoParser(demofile = "DemoManager/SKADE/Inferno/18-04-2021&Young Ninjas.dem", match_id = "astralis-vs-liquid-m1-inferno.dem")


# Parse the demofile, output results to dictionary with df name as key
data = demo_parser.parse()

# The following keys exist
data["Rounds"]
data["Kills"]
data["Damages"]
data["Grenades"]
data["BombEvents"]
data["Footsteps"]

# You can also write the demofile data to JSON using
demo_parser.write_json()