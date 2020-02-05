package com.example.area_android

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.util.Patterns
import android.view.WindowManager
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject


class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_login)
        val app = this.application as AreaApplication

        // Prevent keyboard to show up at activity start
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN)

        val ip = findViewById<EditText>(R.id.login_ip)
        val port = findViewById<EditText>(R.id.login_port)
        val connectButton = findViewById<Button>(R.id.login_connectButton)

        connectButton.setOnClickListener {
            app.serverIp = ip.text.toString()
            app.serverPort = port.text.toString()
            app.generateServerUrl()

            val url: String = app.serverUrl!! + "/services"
            Fuel.get(url)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Failure -> {
                            Toast.makeText(this, "Connection to the server failed", Toast.LENGTH_LONG).show()
                        }
                        is Result.Success -> {
                            Toast.makeText(this, "Connected to the server", Toast.LENGTH_SHORT).show()
                            this.addServices(result.get().obj())
                            this.enableAll()
                        }
                    }
                }
        }

        val email = findViewById<EditText>(R.id.login_username)
        val password = findViewById<EditText>(R.id.login_password)
        val loginButton = findViewById<MaterialButton>(R.id.login_loginButton)

        loginButton.setOnClickListener {
            if (!Patterns.EMAIL_ADDRESS.matcher(email.text).matches()) {
                Toast.makeText(this, "Invalid email", Toast.LENGTH_SHORT).show()
            } else {
                this.basicLogin(email.text.toString(), password.text.toString())
            }

        }

        val registerButton = findViewById<MaterialButton>(R.id.login_registerButton)
        registerButton.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java) // New activity

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish() // Call once you redirect to another activity
        }
    }

    private fun basicLogin(email: String, password: String) {
        val app = this.application as AreaApplication
        val url = app.serverUrl + "/auth/signin"
        val data = hashMapOf<String, Any?>(
            "email" to email,
            "password" to password
        )

        Fuel.post(url)
            .jsonBody(JSONObject(data).toString())
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        println(result.error)
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

    private fun addServices(obj: JSONObject) {
        val serviceButtonsLayout = findViewById<LinearLayout>(R.id.login_serviceButtonsLayout)

        val data: JSONArray = obj.getJSONArray("data")
        for (i in 0 until data.length()) {
            val service: JSONObject = data.getJSONObject(i)
            val icon = service.getString("iconName").replace('-', '_').toUpperCase()

            val d: Drawable =
                MaterialDrawableBuilder.with(this) // provide a context
                    .setIcon(MaterialDrawableBuilder.IconValue.valueOf(icon)) // provide an icon
                    .setColor(Color.WHITE) // set the icon color
                    .setToActionbarSize() // set the icon size
                    .build() // Finally call build

            val button = MaterialButton(this)
            button.text = service.getString("displayName")
            button.icon = d
            button.setOnClickListener {
                this.redirectToService(service.getString("name"))
            }

            serviceButtonsLayout.addView(button)
        }
    }

    private fun redirectToService(serviceName: String) {
        val app = this.application as AreaApplication

        if (serviceName == "dropbox") {
            val intent = Intent(this, DropboxAuthActivity::class.java)

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish()
            return
        }


        val url = app.serverUrl + "/auth/oauth/authorize_url/$serviceName/android"
        Fuel.get(url)
            .responseJson { request, response, result ->
                val data = result.get().obj().getString("data")

                println(data)
                app.redirectAction = AreaApplication.ActionType.Signin
                val webpage: Uri = Uri.parse(data)
                val intent = Intent(Intent.ACTION_VIEW, webpage)
                startActivity(intent)
            }
    }

    private fun enableAll() {
        findViewById<EditText>(R.id.login_username).isEnabled = true
        findViewById<EditText>(R.id.login_password).isEnabled = true
        findViewById<MaterialButton>(R.id.login_loginButton).isEnabled = true
    }
}
