package com.example.area_android

import android.app.Application


class AreaApplication : Application() {
    var serverIp: String? = null
    var serverPort: String? = null
    var serverUrl: String? = null
    var token: String? = null
    var redirectAction: ActionType? = null
    var services: MutableList<String>? = mutableListOf("test")

    enum class ActionType {
        Signin,
        AddService
    }

    fun generateServerUrl() {
        if (this.serverIp == null || this.serverPort == null)
            return
        this.serverUrl = "http://${this.serverIp!!}:${this.serverPort!!}"
    }
}