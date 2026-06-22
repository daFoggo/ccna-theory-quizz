import {
	IconAutomation,
	IconBook,
	IconBrain,
	IconChevronRight,
	IconNetwork,
	IconRouter,
	IconServer,
	IconShield,
} from "@tabler/icons-react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
	BorderGrid,
	BorderGridCell,
	BorderSectionHeader,
} from "@/components/common/grid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/$experimentId/")({
	staticData: {
		getTitle: () => "Study Topic",
		hideSidebar: false,
	},
	component: TopicPage,
});

interface TopicConfig {
	id: string;
	title: string;
	description: string;
	icon: typeof IconNetwork;
	subtopics: { title: string; description: string }[];
}

const TOPICS: Record<string, TopicConfig> = {
	"network-fundamentals": {
		id: "network-fundamentals",
		title: "Network Fundamentals",
		description:
			"Understand the foundational concepts of computer networking, including the OSI model, TCP/IP stack, Ethernet, cabling standards, and network topologies.",
		icon: IconNetwork,
		subtopics: [
			{
				title: "OSI Model",
				description:
					"The seven layers of the OSI reference model and their functions",
			},
			{
				title: "TCP/IP Model",
				description: "Comparison with OSI, protocol suite, and encapsulation",
			},
			{
				title: "Ethernet",
				description: "Frame formats, MAC addressing, switching, and CSMA/CD",
			},
			{
				title: "Cabling & Topologies",
				description: "Twisted pair, fiber optics, coaxial, star, bus, ring",
			},
			{
				title: "IPv4 Addressing",
				description: "Classes, subnetting, VLSM, and CIDR notation",
			},
			{
				title: "IPv6 Basics",
				description: "Address types, representation, and coexistence with IPv4",
			},
		],
	},
	"ip-connectivity": {
		id: "ip-connectivity",
		title: "IP Connectivity",
		description:
			"Learn how routers forward packets across networks using static and dynamic routing protocols such as OSPF.",
		icon: IconRouter,
		subtopics: [
			{
				title: "Routing Fundamentals",
				description: "Path selection, routing tables, administrative distance",
			},
			{
				title: "Static Routing",
				description:
					"Configuring and verifying static routes and default routes",
			},
			{
				title: "Dynamic Routing with OSPF",
				description:
					"OSPF areas, neighbor adjacencies, LSAs, and SPF algorithm",
			},
			{
				title: "Inter-VLAN Routing",
				description: "Router-on-a-stick, SVI, and layer 3 switching",
			},
			{
				title: "First-Hop Redundancy",
				description: "HSRP, VRRP, GLBP for gateway redundancy",
			},
		],
	},
	"ip-services": {
		id: "ip-services",
		title: "IP Services",
		description:
			"Explore essential network services including DHCP, DNS, NAT, and ACLs that enable scalable and secure network operations.",
		icon: IconServer,
		subtopics: [
			{
				title: "DHCP",
				description: "Dynamic host configuration, relay agents, and snooping",
			},
			{
				title: "DNS",
				description: "Name resolution, record types, and caching",
			},
			{
				title: "NAT / PAT",
				description:
					"Static, dynamic, and overload NAT for address translation",
			},
			{
				title: "ACLs",
				description: "Standard, extended, and named access control lists",
			},
			{
				title: "NTP",
				description: "Network time protocol for clock synchronization",
			},
			{
				title: "SNMP & Syslog",
				description: "Network monitoring, traps, and logging",
			},
		],
	},
	security: {
		id: "security",
		title: "Security Fundamentals",
		description:
			"Build a strong foundation in network security concepts including threats, defense mechanisms, VPNs, and firewall technologies.",
		icon: IconShield,
		subtopics: [
			{
				title: "Network Threats",
				description:
					"Types of attacks, mitigation techniques, and security policies",
			},
			{
				title: "Firewalls",
				description:
					"Stateful vs stateless, next-gen firewalls, and ACL-based filtering",
			},
			{
				title: "VPNs",
				description: "IPsec, SSL VPNs, site-to-site and remote access",
			},
			{
				title: "Port Security",
				description: "MAC address filtering, sticky MAC, and violation modes",
			},
			{
				title: "AAA & 802.1X",
				description: "Authentication, authorization, accounting, and NAC",
			},
		],
	},
	automation: {
		id: "automation",
		title: "Automation & Programmability",
		description:
			"Discover modern network automation tools, SDN architectures, and programmable network concepts.",
		icon: IconAutomation,
		subtopics: [
			{
				title: "SDN Architecture",
				description: "Controller-based networking, northbound/southbound APIs",
			},
			{
				title: "REST APIs",
				description: "HTTP methods, JSON, and network device programmability",
			},
			{
				title: "Ansible Basics",
				description: "Playbooks, inventory, and network automation modules",
			},
			{
				title: "Python for Networking",
				description: "Paramiko, Netmiko, and NAPALM for device interaction",
			},
			{
				title: "Controller-Based Deployments",
				description: "Cisco DNA Center, Meraki dashboard",
			},
		],
	},
};

function TopicPage() {
	const { experimentId } = useParams({ from: "/dashboard/$experimentId/" });
	const topic = TOPICS[experimentId];

	if (!topic) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20">
				<h2 className="font-heading text-xl font-semibold text-foreground">
					Topic not found
				</h2>
				<p className="text-sm text-muted-foreground">
					The topic &quot;{experimentId}&quot; does not exist.
				</p>
				<Link to="/dashboard">
					<Button variant="outline">Back to Dashboard</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<div>
				<div className="flex items-center gap-3 mb-1">
					<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<topic.icon className="size-4" />
					</div>
					<h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
						{topic.title}
					</h1>
				</div>
				<p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
					{topic.description}
				</p>
			</div>

			<div>
				<BorderSectionHeader
					title="Subtopics"
					description="Core concepts you need to master"
				/>
				<BorderGrid cols={2}>
					{topic.subtopics.map((subtopic) => (
						<BorderGridCell key={subtopic.title} pad="compact">
							<div className="flex items-start gap-3">
								<div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground">
									<IconBook className="size-3.5" />
								</div>
								<div className="flex min-w-0 flex-1 flex-col">
									<span className="text-sm font-medium text-foreground">
										{subtopic.title}
									</span>
									<span className="text-xs text-muted-foreground mt-0.5">
										{subtopic.description}
									</span>
								</div>
								<IconChevronRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
							</div>
						</BorderGridCell>
					))}
				</BorderGrid>
			</div>

			<div className="flex items-center justify-center gap-3 pt-2">
				<Button>
					<IconBrain />
					Take Quiz
				</Button>
				<Button variant="outline">
					<IconBook />
					Study Mode
				</Button>
			</div>
		</div>
	);
}
