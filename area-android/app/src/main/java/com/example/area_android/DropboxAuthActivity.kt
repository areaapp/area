package com.example.area_android

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONObject

class DropboxAuthActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dropbox_auth)

        val codeInput = findViewById<EditText>(R.id.dropbox_code)
        val ok = findViewById<Button>(R.id.dropbox_ok)
        ok.setOnClickListener {
            if (codeInput.text.isEmpty()) {
                Toast.makeText(this, "Code is empty", Toast.LENGTH_SHORT).show()
            } else {
                val code = codeInput.text.toString()
                this.sendCode(code)
            }
        }

        val app = this.application as AreaApplication
        val url = app.serverUrl + "/auth/oauth/authorize_url/dropbox/android"
        Fuel.get(url)
            .responseJson { request, response, result ->
                val data = result.get().obj().getString("data")

                app.redirectAction = AreaApplication.ActionType.Signin
                val webpage: Uri = Uri.parse(data)
                val intent = Intent(Intent.ACTION_VIEW, webpage)
                startActivity(intent)
            }
    }

    private fun sendCode(code: String) {
        val app = this.application as AreaApplication
        val url = when (app.redirectAction) {
            AreaApplication.ActionType.Signin -> app.serverUrl + "/auth/oauth/signin"
            AreaApplication.ActionType.AddService -> app.serverUrl + "/me/services/dropbox"
            null -> ""
        }

        val requestData = hashMapOf<String, Any?>(
            "service" to "dropbox",
            "authCode" to code,
            "clientType" to "android"
        )

        Fuel.post(url)
            .jsonBody(JSONObject(requestData).toString())
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this, "Invalid credentials", Toast.LENGTH_LONG).show()
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
    }
}
