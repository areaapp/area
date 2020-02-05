package com.example.area_android

import android.app.Activity
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONObject

class SendAuthCodeActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = this.application as AreaApplication
        val data: Uri? = intent?.data

        val service = data!!.path!!.substring(1)
        val code = data!!.getQueryParameter("code")

        val url = when (app.redirectAction) {
            AreaApplication.ActionType.Signin -> app.serverUrl + "/auth/oauth/signin"
            AreaApplication.ActionType.AddService -> app.serverUrl + "/me/services/" + service
            null -> ""
        }

        val requestData = hashMapOf<String, Any?>(
            "service" to service,
            "authCode" to code,
            "clientType" to "android"
        )

        println(code)
        Fuel.post(url)
            .jsonBody(JSONObject(requestData).toString())
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this, "Invalid credentials", Toast.LENGTH_LONG).show()
                        finish()
                    }
                    is Result.Success -> {
                        Toast.makeText(this, "Logged", Toast.LENGTH_SHORT).show()
                        val obj = result.get().obj()
                        val responseData: JSONObject = obj.getJSONObject("data")

                        app.token = responseData.getString("token")
                        val intent = Intent(this, MainActivity::class.java)

                        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                        startActivity(intent)
                        finish()
                    }
                }
            }
        finish()
    }
}
