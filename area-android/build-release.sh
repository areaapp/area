#!/usr/bin/sh

keystore='area-key.jks'
alias='area-android'
pass='123456789'

# Create key
keytool -genkey -noprompt -alias $alias \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -keystore $keystore -storepass $pass \
        -dname "CN=area, OU=area, O=Unknown, L=Unknown, S=Unknown, C=Unknown"


# Build release
./gradlew assembleRelease


# Sign release jar
cp app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release.apk
jarsigner -keystore $keystore -storepass $pass app/build/outputs/apk/release/app-release.apk $alias

