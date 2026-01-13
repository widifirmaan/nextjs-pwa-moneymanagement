import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // In a real app, you'd want to generate these statically or persist them
    // to ensure updates work correctly, but random is fine for a demo.
    const payloadUUID = uuidv4();
    const contentUUID = uuidv4();

    const title = "MoneW";
    const organization = "MoneW Finance";

    // This XML format is what iOS uses for "Configuration Profiles"
    // The "WebClip" payload type creates a home screen icon.
    const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>Icon</key>
            <data>
            </data>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>${title}</string>
            <key>PayloadDescription</key>
            <string>Install MoneW Web App</string>
            <key>PayloadDisplayName</key>
            <string>${title} Web Clip</string>
            <key>PayloadIdentifier</key>
            <string>com.monew.webclip</string>
            <key>PayloadOrganization</key>
            <string>${organization}</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>${contentUUID}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>${baseUrl}</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Installs the MoneW Web App to your Home Screen</string>
    <key>PayloadDisplayName</key>
    <string>${title} Installer</string>
    <key>PayloadIdentifier</key>
    <string>com.monew.profile</string>
    <key>PayloadOrganization</key>
    <string>${organization}</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${payloadUUID}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

    return new NextResponse(mobileConfig, {
        headers: {
            'Content-Type': 'application/x-apple-aspen-config',
            'Content-Disposition': `attachment; filename="monew-installer.mobileconfig"`,
        },
    });
}
