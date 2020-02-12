package com.example.area_android

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONObject

class SendAuthCodeActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = this.application as AreaApplication
        val data: Uri? = intent?.data

        val service = app.authService!!
        val code = data!!.getQueryParameter("code")
        var accessToken: String? = null

        println(service)
        println(code)
        println(accessToken)

        if (data.fragment !== null) {
            accessToken = Regex("(access_token=)(\\w+)").find(data.fragment!!)!!.groups[2]!!.value
        }

        val url = when (app.redirectAction) {
            AreaApplication.ActionType.Signin -> app.serverUrl + "/auth/oauth/signin"
            AreaApplication.ActionType.AddService -> app.serverUrl + "/me/services/" + service
            null -> ""
        }

        val requestData = hashMapOf<String, Any?>(
            "service" to service,
            "clientType" to "android"
        )

        if (accessToken == null) {
            requestData["authCode"] = code
        } else {
            requestData["accessToken"] = accessToken
        }

        if (app.redirectAction === AreaApplication.ActionType.Signin) {
            this.login(url, requestData)
        } else {
            this.addService(url, requestData, service)
        }
        finish()
    }

    private fun login(url: String, requestData: HashMap<String, Any?>) {
        val app = this.application as AreaApplication
        Fuel.post(url)
            .jsonBody(JSONObject(requestData).toString())
            .responseJson { _, _, result ->
                when (result) {
                    is Result.Failure -> {
                        println(result.error)
                        Toast.makeText(this, "Invalid credentials", Toast.LENGTH_LONG).show()
                        finish()
                    }
                    is Result.Success -> {
                        Toast.makeText(this, "Logged", Toast.LENGTH_SHORT).show()
                        val obj = result.get().obj()
                        val responseData: JSONObject = obj.getJSONObject("data")

                        app.token = responseData.getString("token")
                        val intent = Intent(this, MainActivity::class.java)

                        intent.flags =
                            Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)
                        finish()
                    }
                }
            }
    }

    private fun addService(url: String, requestData: HashMap<String, Any?>, service: String) {
        val app = this.application as AreaApplication
        Fuel.post(url)
            .authentication()
            .bearer(app.token!!)
            .jsonBody(JSONObject(requestData).toString())
            .responseJson { _, _, result ->
                when (result) {
                    is Result.Failure -> {
                        println(result.error)
                        Toast.makeText(this, "Invalid credentials", Toast.LENGTH_LONG).show()
                        finish()
                    }
                    is Result.Success -> {
                        Toast.makeText(this, "Service added", Toast.LENGTH_SHORT).show()
                        val intent = Intent(this, ServiceActivity::class.java)

                        intent.putExtra("service", service)
                        startActivity(intent)
                        finish()
                    }
                }
            }
    }
}
